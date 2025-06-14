<?php

/**
 * @author Barış Kudret & Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Controller\Service\Search\PlaceCommentSearchService;
use App\Controller\Service\PlaceComment\PlaceCommentRateCountService;
use Symfony\Component\HttpFoundation\Request;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use App\Client\YakalaApiClient;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class PlaceReviewController extends AbstractPartnerController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client, private readonly PlaceCommentSearchService $service, private readonly PlaceCommentRateCountService $placeCommentRateCountService) {}

    /**
     * Displays the place reviews page with filtering and pagination.
     *
     * This controller action handles requests for the review listing page.
     * It uses the PlaceCommentSearchService to fetch review data from Elasticsearch
     * based on the request parameters, processes the response to extract reviews and
     * pagination data, and then renders the main Twig template with this data.
     *
     * @param Request $request The incoming HTTP request, containing filter and pagination query parameters.
     * @return Response The rendered HTML page for the reviews list.
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface When the API call fails.
     */
    #[Route('partner/place/review', name: 'partner_place_review')]
    public function index(Request $request): Response
    {
        $jsonResponse = $this->service->search($request, $this->getActivePlace($request));

        $esResponse = json_decode($jsonResponse->getContent(), true);

        $reviews = array_map(function ($hit) {
            return $hit['_source'];
        }, $esResponse['hits']['hits'] ?? []);

        $total = $esResponse['hits']['total']['value'] ?? 0;

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = (int)$request->query->get('limit', 5);

        $totalPages = ($limit > 0) ? ceil($total / $limit) : 0;
        $rateCounts = $this->placeCommentRateCountService->searchWithRateDistribution($request, $this->getActivePlace($request));
        $total = array_sum($rateCounts);

        $sum = 0;
        foreach ($rateCounts as $rate => $count) {
            $sum += $rate * $count;
        }

        $avg = $total > 0 ? round($sum / $total, 1) : 0;

        $ratePercentages = [];
        foreach ($rateCounts as $rate => $count) {
            $ratePercentages[$rate] = $total > 0 ? round(($count / $total) * 100) : 0;
        }

        return $this->render('partner/layouts/review/review.html.twig', [
            'reviews' => $reviews,
            'total' => $total,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'request' => $request,
            'placeId' => $this->getActivePlace($request),
            'rate_counts' => $rateCounts,
            'rate_percentages' => $ratePercentages,
            'total_votes' => $total,
            'avg' => $avg,
        ]);
    }
}
