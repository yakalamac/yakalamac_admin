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

        return $this->client->search($index, $this->buildQuery($subject, $size, $from));
    }

    /**
     * @param string $text
     * @param int $size
     * @param int $from
     * @return int[]
     */
    private function buildQuery(string $text, int $size, int $from): array
    {
        $query = ['size'=>$size, 'from'=>$from];

        if(empty($subject)) {
            $query['query'] = ['match_all' => (object)[]];
            return $query;
        }

        $query['query'] = [
            'bool' => [
                'should' => [
                    [
                        'prefix' => [
                            'name' => $text,
                        ]
                    ],
                    [
                        'fuzzy' => [
                            'name' => [
                                'value' => $text,
                                'fuzziness' => 'AUTO'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return $query;
    }

    protected function getTag(): string
    {
        return 'elastica.text';
    }
}