<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Client\ElasticaClient;
use App\Manager\Abstract\AbstractClientManager;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaTextManager extends AbstractClientManager
{
    /**
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ElasticaClient $client) {}

    /**
     * @param $subject
     * @param string|null $index
     * @param int|null $size
     * @param int|null $from
     * @return Response
     * @throws Throwable
     */
    public function manage($subject, ?string $index = NULL, ?int $size = 15, ?int $from = 0): Response
    {
        if(!is_string($subject)) {
            throw new Exception('Subject must be a string which is going to be searched.');
        }

        if($index === NULL) {
            throw new Exception('Index name cannot be null.');
        }

        $keys = $this->findKey($index);

        $query = $this->buildQuery($subject, $size, $from, $keys);

        $response = $this->client->search($index, $query);

        return $this->client->toResponse($response);
    }

    /**
     * @param string $text
     * @param int $size
     * @param int $from
     * @param $keys
     * @return int[]
     */
    private function buildQuery(string $text, int $size, int $from, $keys): array
    {
        $query = ['size'=>$size, 'from'=>$from];

        if(empty($text)) {
            $query['query'] = ['match_all' => (object)[]];
            return $query;
        }

        if(count($keys) === 0) {
            return $query;
        }

        $query['query'] = ['bool' => ['should' => []]];

        foreach ($keys as $key) {
            $query['query']['bool']['should'][] = [
                'prefix' => [
                    $key => $text,
                ]
            ];
            $query['query']['bool']['should'][] = [
                'fuzzy' => [
                    $key => [
                        'value' => $text,
                        'fuzziness' => 'AUTO'
                    ]
                ]
            ];
        }

        return $query;
    }

    const fixedKeys = [
        [
            'match' => ['product', 'place'],
            'keys' => ['name']
        ],
        [
            'contains' => ['type', 'category'],
            'keys' => ['description', 'title']
        ],
        [
            'contains' => ['tag'],
            'keys' => ['tag']
        ]
    ];

    /**
     * @param string $index
     * @return array
     */
    function findKey(string $index): array
    {
        $keys = [];
        foreach (self::fixedKeys as $current) {
            if(isset($current['match']) && in_array($index, $current['match'])) {
                $keys = array_merge($keys, $current['keys']);
            }

            if(isset($current['contains'])) {
                foreach ($current['contains'] as $str) {
                    if(str_contains($index, $str)) {
                        $keys = array_merge($keys, $current['keys']);
                    }
                }
            }
        }

        return $keys;
    }

    protected function getTag(): string
    {
        return 'elastica.text';
    }
}