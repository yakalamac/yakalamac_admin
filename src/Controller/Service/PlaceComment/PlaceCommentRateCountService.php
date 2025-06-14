<?php

/**
 * @author  Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Service\PlaceComment;

use App\Manager\Elastica\ElasticaSearchManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PlaceCommentRateCountService extends AbstractController
{
  /**
   * @var ElasticaSearchManager The Elastica search manager for executing queries.
   */
  private ElasticaSearchManager $manager;

  /**
   * PlaceCommentSearchService constructor.
   * @param ElasticaSearchManager $manager
   */
  public function __construct(ElasticaSearchManager $manager)
  {
    $this->manager = $manager;
  }

  /**
   * Searches for comments and counts the distribution of rates for a specific place.
   *
   * This method builds an Elasticsearch query to filter comments by place ID
   * and aggregates the count of comments for each rate (1 to 5).
   *
   * @param Request $request The current request object, used to build the query.
   * @param string $placeId The ID of the place for which to count rates.
   * @return array An associative array with rate counts indexed by rate value (1-5).
   */
  public function searchWithRateDistribution(Request $request, string $placeId): array
  {
    $query = $this->buildQuery($request);

    $query['query']['bool']['filter'][] = [
      'term' => ['place' => $placeId]
    ];

    $query['aggs'] = $this->buildCountRateAggregation();

    $result = $this->manager->manage('place_comment', $query);
    $data = json_decode($result->getContent(), true);
    $buckets = $data['aggregations']['rate_distribution']['buckets'] ?? [];
    $rates = array_fill(1, 5, 0);
    foreach ($buckets as $bucket) {
      $rate = (int)$bucket['key'];
      $count = (int)$bucket['doc_count'];
      if (isset($rates[$rate])) {
        $rates[$rate] = $count;
      }
    }

    return $rates;
  }

  /**
   * Builds the base query for counting rate distribution.
   *
   * This method initializes the Elasticsearch query structure with a size of 0
   * and a filter for the specified place ID. It prepares the query to be extended
   * with aggregations later.
   *
   * @param Request $request The current request object, used to build the query.
   * @return array The base query configuration.
   */  
  private function buildQuery(Request $request): array
  {
    $query = [
      'size' => 0,
      'query' => [
        'bool' => [
          'filter' => []
        ]
      ],
      'aggs' => []
    ];

    return $query;
  }

  /**
   * Builds the aggregation for counting rate distribution.
   *
   * This method constructs the aggregation part of the Elasticsearch query
   * to count how many comments there are for each rate (1 to 5).
   *
   * @return array The aggregation configuration.
   */
  private function buildCountRateAggregation(): array
  {
    return [
      'rate_distribution' => [
        'terms' => [
          'field' => 'rate',
          'size' => 5,
          'order' => [
            '_key' => 'desc'
          ]
        ]
      ]
    ];
  }
}
