<?php

/**
 * @author  Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Service\Search;

use App\Manager\Elastica\ElasticaSearchManager;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PlaceCommentSearchService extends AbstractController
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
   * Builds and executes the final search query for a specific place.
   * This method orchestrates the query building by calling `buildQuery` and then
   * appends the mandatory `placeId` filter before sending it to the manager.
   *
   * @param Request $request The incoming HTTP request containing query parameters.
   * @param string $placeId The UUID of the place to filter comments for.
   * @return mixed The result from the ElasticaSearchManager's manage method.
   */
  public function search(Request $request, string $placeId)
  {
    $query = $this->buildQuery($request);

    if (!isset($query['query']['bool']['filter'])) {
      $query['query']['bool']['filter'] = [];
    }

    $query['query']['bool']['filter'][] = [
      'term' => [
        'place' => $placeId
      ]
    ];

    return $this->manager->manage('place_comment', $query);
  }

  /**
   * Builds the main Elasticsearch query by assembling various filter parts.
   * This method initializes the base query structure (pagination, sorting) and then
   * iteratively calls other builder methods to add filter clauses based on request parameters.
   *
   * @param Request $request The incoming HTTP request.
   * @return array The fully constructed Elasticsearch query array.
   */
  protected function buildQuery(Request $request): array
  {
    $page = $request->query->get('page', 1);
    $limit = $request->query->get('limit', 5);

    $query = [
      'query' => [
        'bool' => [
          'must' => [],
          'filter' => []
        ]
      ],
      'size' => $limit,
      'from' => ($page - 1) * $limit,
      'sort' => [
        ['createdAt' => ['order' => 'desc']]
      ]
    ];

    foreach (['Rate', 'Text', 'Photos', 'Filter'] as $scope) {
      $methodName = "build" . $scope . "Query";
      if (method_exists($this, $methodName)) {
        $query = $this->$methodName($request, $query);
      }
    }

    if (empty($query['query']['bool']['must'])) {
      unset($query['query']['bool']['must']);
    }

    return $query;
  }

  /**
   * Adds a rating filter to the Elasticsearch query.
   * Filters for comments where the 'rate' is greater than or equal to the provided value.
   * Does nothing if the rate parameter is not provided or invalid.
   *
   * @param Request $request The incoming HTTP request.
   * @param array $query The existing query array to modify.
   * @return array The modified query array.
   */
  protected function buildRateQuery(Request $request, array $query): array
  {
    $rate = $request->query->get('rate', null);

    if ($rate === null || !is_numeric($rate) || $rate < 0 || $rate > 5) {
      return $query;
    }

    if (!isset($query['query']['bool']['must'])) {
      $query['query']['bool']['must'] = [];
    }

    $query['query']['bool']['must'][] = [
      'range' => [
        'rate' => [
          'gte' => $rate,
          'lte' => 5
        ]
      ]
    ];

    return $query;
  }

  /**
   * Adds a filter to find comments that have text.
   * Ensures that the 'text' field exists and is not empty.
   * Does nothing if the text parameter is not present in the request.
   *
   * @param Request $request The incoming HTTP request.
   * @param array $query The existing query array to modify.
   * @return array The modified query array.
   */
  protected function buildTextQuery(Request $request, array $query): array
  {
    $text = $request->query->get('text', null);

    if ($text === null) {
      return $query;
    }
    if (!isset($query['query']['bool']['must'])) {
      $query['query']['bool']['must'] = [];
    }

    $query['query']['bool']['must'][] = [
      'exists' => [
        'field' => 'text'
      ]
    ];

    $query['query']['bool']['must'][] = [
      'wildcard' => [
        'text' => [
          'value' => '*'
        ]
      ]
    ];

    return $query;
  }

  /**
   * Adds a filter to find comments that have photos.
   * Uses a nested query to check for the existence of 'photos.src'.
   *
   * @param Request $request The incoming HTTP request.
   * @param array $query The existing query array to modify.
   * @return array The modified query array.
   */
  public function buildPhotosQuery(Request $request, array $query)
  {
    $photos = $request->query->get('photos', null);

    if ($photos === null) {
      return $query;
    }

    if (!isset($query['query']['bool']['must'])) {
      $query['query']['bool']['must'] = [];
    }

    $query['query']['bool']['must'][] = [
      'nested' => [
        'path' => 'photos',
        'query' => [
          'exists' => [
            'field' => 'photos.src'
          ]
        ]
      ]
    ];

    return $query;
  }

  /**
   * Adds date-based filters to the Elasticsearch query.
   * Handles 'last_7_days', 'last_30_days', and custom date ranges.
   *
   * @param Request $request The incoming HTTP request.
   * @param array $query The existing query array to modify.
   * @return array The modified query array.
   */
  public function buildFilterQuery(Request $request, array $query)
  {
    $filter = $request->query->get('filter');
    if ($filter == 'custom') {
      if (!($request->query->has('startDate') && $request->query->has('endDate'))) {
        return $query;
      }

      $startDate = $request->query->get('startDate');
      $endDate = $request->query->get('endDate');

      $query['query']['bool']['filter'][] = [
        'range' => [
          'createdAt' => [
            'gte' => $startDate,
            'lte' => $endDate
          ]
        ]
      ];
    }
    $subQuery = match ($filter) {
      'last_7_days' => [
        'range' => [
          'createdAt' => [
            'gte' => 'now-7d/d',
            'lte' => 'now/d'
          ]
        ]
      ],
      'last_30_days' => [
        'range' => [
          'createdAt' => [
            'gte' => 'now-30d/d',
            'lte' => 'now/d'
          ]
        ]
      ],
      default => null
    };
    if ($subQuery != null) {
      $query['query']['bool']['filter'][] = $subQuery;
    }
    return $query;
  }
}
