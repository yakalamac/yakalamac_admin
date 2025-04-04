<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Client\ElasticaClient;
use App\Manager\Abstract\AbstractClientManager;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaAutocompleteManager extends AbstractClientManager
{
    /**
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ElasticaClient $client) {}

    /**
     * @param $subject
     * @param string|null $text
     * @return mixed
     * @throws Throwable
     */
    public function manage($subject, ?string $text = NULL): Response
    {
        $response = $this->client->search($subject, $this->buildQuery($text));

        return $this->client->toResponse($response);
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

    protected function getTag(): string
    {
        return 'elastica.autocomplete';
    }
}