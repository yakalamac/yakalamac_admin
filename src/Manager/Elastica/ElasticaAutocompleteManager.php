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
        if(!is_string($text)) {
            throw new Exception('Text must be provided.');
        }

        // TODO Make this more efficient and flexible. Also design it more modular
        if($subject === NULL) {
            $response = $this->client->multisearch($this->multisearchQuery($text));
        } else {
            $key = $this->keyFromIndex($subject);
            $response = $this->client->search($subject, $this->buildQuery($key, $text));
        }

        return $this->client->toResponse($response);
    }

    /**
     * @param string $key
     * @param string $text
     * @return array
     */
    private function buildQuery(string $key, string $text): array
    {
        return [
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'match_phrase_prefix' => [
                                $key => [
                                    'query' => $text,
                                    'slop' => 2
                                ]
                            ]
                        ],
                        [
                            'fuzzy' => [
                                $key => [
                                    'value' => $text,
                                    'fuzziness' => 'AUTO'
                                ]
                            ]
                        ],
                        [
                            'match' => [
                                $key => [
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

    private function multisearchQuery(string $text): string
    {
        $query = "";

        $textArray = explode(" ", trim($text));
        foreach (['place', 'product', "place_category", "place_type", "place_tag", "product_category", "product_type", "product_tag"] as $index) {
            foreach ($textArray as $text) {
                $query .= json_encode(["index" => $index]) . "\n";
                $query .= json_encode(
                    $this->buildQuery(
                        $this->keyFromIndex($index), $text)
                    ) . "\n";
            }
        }

        return rtrim($query, "\n") . "\n\n";
    }

    /**
     * @return string
     */
    protected function getTag(): string
    {
        return 'elastica.autocomplete';
    }

    /**
     * @param string $index
     * @return string
     */
    private function keyFromIndex(string $index): string
    {
        return match ($index) {
            'place', 'product'=> 'name',
            "product_category", "place_category" => "category",
            "place_type", "product_type" => "type",
            "place_tag", "product_tag"=> "tag",
            default => "name"
        };
    }
}