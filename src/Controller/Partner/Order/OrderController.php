<?php
/**
 * @author Onur Kudret & Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Partner\Order;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

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

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/cancelled', name: 'partner_order_cancelled')]
    public function cancelled(Request $request): Response
    {
        $id = $this->getActivePlace($request);

        if ($id == NULL) {
            return $this->redirectToRoute('login_page');
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 15);

        //TODO Abi burda api filtrelemeden gönderdiği icin 1000 limit ayarladım
        // ilerde bunun daha güzel mantığa kavusması gerek <3
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

        $data = $this->client->toArray($response);

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

    /**
     * @return Response
     */
    #[Route('/customer/reqs', name: 'partner_order_customer_requests')]
    public function customer_requests(): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/history', name: 'partner_order_history')]
    public function history(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId === NULL) {
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

    /**
     * @param Request $request
     * @param string $orderId
     * @return Response
     * @throws Throwable
     */
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

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     * @throws TransportExceptionInterface
     */
    #[Route('/update_order_status', name: 'update_order_status')]
    public function update_order_status(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId == NULL) {
            return $this->redirectToRoute('login_page');
        }

        $content = json_decode($request->getContent(), true);
        $orderId = $content['id'] ?? null;
        $status = $content['status'] ?? null;

        if (!$orderId || !$status) {
            return new Response('Invalid input: id and status are required.', Response::HTTP_BAD_REQUEST);
        }

        $data = ['status' => $status];

        $response = $this->client->patch("orders/$orderId", [
            'headers' => [
                'accept' => 'application/ld+json',
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/merge-patch+json'
            ],
            'json' => $data
        ]);

        if($this->client->isSuccess($response)) {
            return new JsonResponse([
                'message' => 'Order status updated successfully.'
            ], Response::HTTP_OK);
        }

        $responseContent = $this->client->toArray($response);

        $errorMessage = $responseContent['hydra:description'] ?? 'Unknown error';

        return new JsonResponse([
            'error' => 'Failed to update order status: ' . $errorMessage
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     * @throws Throwable
     * @throws TransportExceptionInterface
     */
    #[Route('/view_order', name: '/view_order')]
    public function view_order(Request $request): RedirectResponse|JsonResponse
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId === NULL) {
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

        $responseContent = $this->client->toArray($response);

        if(!$this->client->isSuccess($response))
        {
            return new JsonResponse([
                'error' => 'Failed to get order details.',
                'details' => $responseContent
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse($responseContent, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return RedirectResponse|Response
     * @throws Throwable
     */
    #[Route('/waiting', name: 'partner_order_waiting')]
    public function waiting_orders(Request $request): RedirectResponse|Response
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId == NULL) {
            return $this->redirectToRoute('login_page');
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $response = $this->client->get("place/$placeId/orders", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/json',
            ],
            'query' => [
                'page' => 1,
                'limit' => 1000
            ]
        ]);

        $data = $this->client->toArray($response);

        // Filter the orders based on their status
        $filteredNewOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return in_array($order['status'], ['pending', 'accepted']);
        }));

        $filteredContinueOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return in_array($order['status'], ['preparing', 'delivery', 'delivered']);
        }));

        // Sort orders by date
        $sortedNewOrders = $this->sortOrdersByDate($filteredNewOrders);
        $sortedContinueOrders = $this->sortOrdersByDate($filteredContinueOrders);

        // Pagination
        $newTotalItems = count($sortedNewOrders);
        $newTotalPages = (int) ceil($newTotalItems / $limit);
        $newOffset = ($page - 1) * $limit;
        $paginatedNewOrders = array_slice($sortedNewOrders, $newOffset, $limit);

        $continueTotalItems = count($sortedContinueOrders);
        $continueTotalPages = (int) ceil($continueTotalItems / $limit);
        $continueOffset = ($page - 1) * $limit;
        $paginatedContinueOrders = array_slice($sortedContinueOrders, $continueOffset, $limit);

        return $this->render('partner/layouts/order/order-management.html.twig', [
            'newOrders' => $paginatedNewOrders,
            'newOrdersPage' => $page,
            'newOrdersTotalPages' => $newTotalPages,

            'continueOrders' => $paginatedContinueOrders,
            'continueOrdersPage' => $page,
            'continueOrdersTotalPages' => $continueTotalPages,

            'limit' => $limit,
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     * @throws Throwable
     */
    #[Route('/list', 'view_list')]
    public function view_orders(Request $request): RedirectResponse|JsonResponse
    {
        $placeId = $this->getActivePlace($request);

        if ($placeId == NULL) {
            return $this->redirectToRoute('login_page');
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $response = $this->client->get("place/$placeId/orders", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type' => 'application/json',
            ],
            'query' => [
                'page' => 1,
                'limit' => 1000
            ]
        ]);

        $data = $this->client->toArray($response);

        // Filter the orders based on their status
        $filteredNewOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return in_array($order['status'], ['pending', 'accepted']);
        }));

        $filteredContinueOrders = array_values(array_filter($data['hydra:member'], function ($order) {
            return in_array($order['status'], ['preparing', 'delivery', 'delivered']);
        }));

        // Sort the orders by their creation date
        $sortedNewOrders = $this->sortOrdersByDate($filteredNewOrders);
        $sortedContinueOrders = $this->sortOrdersByDate($filteredContinueOrders);

        // Pagination
        $newTotalItems = count($sortedNewOrders);
        $newTotalPages = (int) ceil($newTotalItems / $limit);
        $newOffset = ($page - 1) * $limit;
        $paginatedNewOrders = array_slice($sortedNewOrders, $newOffset, $limit);

        $continueTotalItems = count($sortedContinueOrders);
        $continueTotalPages = (int) ceil($continueTotalItems / $limit);
        $continueOffset = ($page - 1) * $limit;
        $paginatedContinueOrders = array_slice($sortedContinueOrders, $continueOffset, $limit);

        return new JsonResponse([
            'newOrders' => $paginatedNewOrders,
            'newOrdersPage' => $page,
            'newOrdersTotalPages' => $newTotalPages,

            'continueOrders' => $paginatedContinueOrders,
            'continueOrdersPage' => $page,
            'continueOrdersTotalPages' => $continueTotalPages,

            'limit' => $limit,
        ], status: Response::HTTP_OK);
    }

    /**
     * Sorts an array of orders by their creation date in descending order.
     *
     * @param array $orders An array of orders, each containing a 'createdAt' key with a date string.
     * @return array The sorted array of orders, with the most recently created orders first.
     */
    public function sortOrdersByDate(array $orders): array
    {
        usort($orders, function ($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        return $orders;
    }
}
