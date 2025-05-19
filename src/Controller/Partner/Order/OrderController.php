<?php

/**
 * @author Onur Kudret & Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Partner\Order;

use Symfony\Component\HttpFoundation\Request;
use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Service\Attribute\Required;

#[Route('/partner/order')]
class OrderController extends AbstractPartnerController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @return Response
     */
    #[Route('/zones', name: 'partner_order_zones')]
    public function zones(): Response
    {
        return $this->render('partner/layouts/order/zones.html.twig');
    }

    #[Route('/waiting', name: 'partner_order_waiting')]
    public function waiting(Request $request): Response
    {
        $id = $this->getActivePlace($request);
        if ($id == null) {
            return $this->redirectToRoute('login_page');
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 15);

        // API tarafı filtrelemediği için limit yüksek
        $response = $this->client->get("place/$id/orders", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/json',
            ],
            'query' => [
                'page' => 1,
                'limit' => 1000
            ]
        ]);

        $data = $response->toArray();

        $filteredOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return $order['status'] === 'pending';
        }));

        usort($filteredOrders, function ($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        $totalItems = count($filteredOrders);
        $totalPages = (int) ceil($totalItems / $limit);
        $offset = ($page - 1) * $limit;
        $paginatedOrders = array_slice($filteredOrders, $offset, $limit);

        return $this->render('partner/layouts/order/waiting.html.twig', [
            'orders' => $paginatedOrders,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'limit' => $limit,
        ]);
    }

    #[Route('/cancelled', name: 'partner_order_cancelled')]
    public function cancelled(Request $request): Response
    {
        $id = $this->getActivePlace($request);

        if ($id == null) {
            return $this->redirectToRoute('login_page');
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 15);

        //abi burda api filtrelemeden gönderdiği icin 1000 limit ayarladım ilerde bunun daha güzel mantığa kavusması gerek <3
        $response = $this->client->get("place/$id/orders", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/json',
            ],
            'query' => [
                'page' => 1,
                'limit' => 1000
            ]
        ]);

        $data = $response->toArray();

        $filteredOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return in_array($order['status'], ['cancelled_user', 'cancelled_business', 'rejected']);
        }));

        usort($filteredOrders, function ($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        $totalItems = count($filteredOrders);
        $totalPages = (int) ceil($totalItems / $limit);
        $offset = ($page - 1) * $limit;
        $cancelledOrders = array_slice($filteredOrders, $offset, $limit);

        return $this->render('partner/layouts/order/cancelled.html.twig', [
            'orders' => $cancelledOrders,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'limit' => $limit,
        ]);
    }

    #[Route('/customer/reqs', name: 'partner_order_customer_requests')]
    public function customer_requests(): Response
    {
        return new Response();
    }

    #[Route('/history', name: 'partner_order_history')]
    public function history(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);
        if ($placeId === null) {
            return $this->redirectToRoute('login_page');
        }

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 15;

        $response = $this->client->get("place/$placeId/orders", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/json',
            ],
            'query' => [
                'page' => $page,
                'limit' => $limit,
            ],
        ]);

        $data = $this->client->toArray($response);

        $orders = $data['hydra:member'];
        $totalItems = $data['hydra:totalItems'];
        $totalPages = ceil($totalItems / $limit);

        usort($orders, function ($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        return $this->render('partner/layouts/order/index.html.twig', [
            'orders' => $orders,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/detail/{orderId}', name: 'order_detail')]
    public function order_detail(Request $request, string $orderId): Response
    {
        $id = $this->getActivePlace($request);

        if ($id == null) {
            return $this->redirectToRoute('login_page');
        }

        $response = $this->client->get("orders/$orderId", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'accept' => 'application/ld+json',
                'Content-Type' => 'application/json',
            ]
        ]);

        return $this->render('partner/layouts/order/detail.html.twig', [
            'order' => $this->client->toArray($response)
        ]);
    }

    #[Route('/update_order_status', name: 'update_order_status')]
    public function updateOrderStatus(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId == null) {
            return $this->redirectToRoute('login_page');
        }

        $content = json_decode($request->getContent(), true);
        $orderId = $content['id'] ?? null;
        $status = $content['status'] ?? null;

        if (!$orderId || !$status) {
            return new Response('Invalid input: id and status are required.', Response::HTTP_BAD_REQUEST);
        }
        
        $data = [
            'status' => $status
        ];

        $response = $this->client->patch("orders/$orderId", [
            'headers' => [
                'accept' => 'application/ld+json',
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/merge-patch+json'
            ],
            'json' => $data
        ]);

        $statusCode = $response->getStatusCode();
        $responseContent = $response->toArray();

        if ($statusCode === 200) {
            return new Response(
                'Order status updated successfully.',
                Response::HTTP_OK
            );
        }

        $errorMessage = $responseContent['hydra:description'] ?? 'Unknown error';
        return new Response(
            'Failed to update order status: ' . $errorMessage,
            Response::HTTP_BAD_REQUEST
        );
    }
    
    #[Route('/view_order', name: '/view_order')]
    /**
     * @param Request $request
     * @return Response
     */

    public function viewOrder(Request $request)
    { {
            $placeId = $this->getActivePlace($request);

            if ($placeId === null) {
                return $this->redirectToRoute('login_page');
            }

            $content = json_decode($request->getContent(), true);
            $orderId = $content['id'] ?? null;

            if (!$orderId) {
                return new JsonResponse(['error' => 'Invalid input: id required.'], Response::HTTP_BAD_REQUEST);
            }

            $response = $this->client->get("orders/$orderId", [
                'headers' => [
                    'accept' => 'application/ld+json',
                    'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                    'Content-Type' => 'application/ld+json'
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $responseContent = $response->toArray();

            if ($statusCode === 200) {
                // Cevabı JSON olarak döndür
                return new JsonResponse($responseContent, Response::HTTP_OK);
            }

            return new JsonResponse([
                'error' => 'Failed to get order details.',
                'details' => $responseContent
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
