<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Manager\Abstract\AbstractClientManagerManager;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaAutocompleteManager extends AbstractClientManagerManager
{
    /**
     * @param $subject
     * @return mixed
     * @throws Throwable
     */
    public function manage($subject): Response
    {
        $query = $this->buildQuery($subject);

        $response = $this->client->request('place/_search', 'POST', $query);

        return $this->handleResponse($response);
    }

    /**
     * @param string $text
     * @return array
     */
    private function buildQuery(string $text): array
    {
        return [
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'match_phrase_prefix' => [
                                'name' => [
                                    'query' => $text,
                                    'slop' => 2
                                ]
                            ]
                        ],
                        [
                            'fuzzy' => [
                                'name' => [
                                    'value' => $text,
                                    'fuzziness' => 'AUTO'
                                ]
                            ]
                        ],
                        [
                            'match' => [
                                'name' => [
                                    'query' => $text,
                                    'operator' => 'and'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'size' => 15,
        ];
    }
}