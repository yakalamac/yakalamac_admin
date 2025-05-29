<?php

/**
 * @author Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use Exception;
use Symfony\Component\HttpFoundation\Request;
use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

class PointMarketController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route("/admin/point_market", name: 'point_market')]
    public function index(Request $request): Response
    {
        $page = (int) $request->query->get('page', 1);
        $limit = (int) $request->query->get('example_length', 10);

        $response = $this->client->get('point_rewards', [
          'query' => [
            'page' => $page,
            'limit' => $limit,
          ]
        ]);

        $data = $response->toArray();
        $rewards = $data['hydra:member'] ?? [];
        $totalItems = $data['hydra:totalItems'] ?? 0;

        $totalPages = ceil($totalItems / $limit);

        return $this->render('admin/pages/point-market/index.html.twig', [
          'rewards' => $rewards,
          'currentPage' => $page,
          'totalPages' => $totalPages,
          'totalItems' => $totalItems,
          'limit' => $limit
        ]);
    }

    /**
     * @return Response
     */
    #[Route("/admin/point_market/add", name: 'point_market_add_view', methods: ['GET'])]
    public function showAddMarketPage(): Response
    {
        return $this->render('admin/pages/point-market/add.html.twig');
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route("/admin/point_market/add", name: 'point_market_add', methods: ['POST'])]
    public function addMarket(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $requiredFields = ['name', 'price', 'stock', 'status', 'startAt', 'endAt', 'detail', 'cycleDays'];

        foreach ($requiredFields as $field) {
          if (!array_key_exists($field, $data)) {
            return $this->json(['error' => "Missing field: $field"], 400);
          }
        }

        $response = $this->client->post('point_rewards',  [
          'headers' => [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
          ],
          'json' => $data,
        ]);

        $status = $response->getStatusCode();
        $content = json_decode($response->getContent(false), true);

        return $this->json([
          'status' => $status,
          'response' => $content,
          'redirect' => $this->generateUrl('point_market')
        ]);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @throws Throwable,
     */
    #[Route("/admin/point_market/delete/{id}", name: 'app_point_market_delete')]
    public function delete(int $id): JsonResponse
    {
        try {
            $response = $this->client->delete("point_rewards/{$id}");
            $result = $this->client->toArray($response);

            if (isset($result['success']) && $result['success']) {
                return new JsonResponse(['success' => true]);
            } else {
                return new JsonResponse(['success' => false], 400);
            }
        } catch (Exception $exception) {
            return new JsonResponse(['success' => false, 'error' => $exception->getMessage()], 500);
        }
    }

    /**
     * @param int $id
     * @return Response
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws DecodingExceptionInterface
     */
    #[Route("/admin/point_market/edit/{id}", name: 'point_market_edit_view', methods: ['GET'])]
    public function showEditMarketPage(int $id): Response
    {
        $response = $this->client->get("point_rewards/{$id}");
        $reward = $response->toArray();

        return $this->render('admin/pages/point-market/edit.html.twig', [
          'reward' => $reward,
        ]);
    }

    /**
     * @param Request $request
     * @param int $id
     * @return Response
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route("/admin/point_market/edit/{id}", name: 'point_market_edit', methods: ['POST'])]
    public function editMarket(Request $request, int $id): Response
    {
        $data = [
          'name' => $request->request->get('name'),
          'price' => (int)$request->request->get('price'),
          'stock' => (int)$request->request->get('stock'),
          'status' => $request->request->get('status'),
          'startAt' => $request->request->get('startAt'),
          'endAt' => $request->request->get('endAt'),
          'detail' => $request->request->get('detail'),
          'cycleDays' => (int)$request->request->get('cycleDays'),
        ];

        foreach ($data as $key => $value) {
          if ($value === null || $value === '') {
            return $this->json(['error' => "Eksik alan: $key"], 400);
          }
        }

        // Eğer görsel de varsa:
        /** @var UploadedFile|null $image */
        $image = $request->files->get('image');

        if ($image) {
          // Görseli işle
          // Örneğin, dosyayı kaydet veya base64 formatında API'ye gönder
          // image->move() ile dosya yükleme işlemi yapılabilir
        }

        $response = $this->client->patch("point_rewards/$id", [
          'headers' => [
            'Content-Type' => 'application/merge-patch+json',
            'Accept' => 'application/json',
          ],
          'json' => $data,
        ]);

        $status = $response->getStatusCode();
        $content = json_decode($response->getContent(false), true);

        return $this->json([
          'status' => $status,
          'response' => $content,
          'redirect' => $this->generateUrl('point_market')
        ]);
    }
}
