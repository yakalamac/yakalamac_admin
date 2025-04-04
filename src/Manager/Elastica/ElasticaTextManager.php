<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Manager\Abstract\AbstractClientManager;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaTextManager extends AbstractClientManager
{
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

        if($this->client === NULL) {
            throw new Exception('Manager is not initialized.');
        }

        $query = $this->buildQuery($subject, $size, $from);

        $response = $this->client->request("$index/_search", 'POST', $query);

        return $this->handleResponse($response);
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