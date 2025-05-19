<?php

/**
 * @author Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use Symfony\Component\HttpFoundation\Request;
use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PointMarketController extends BaseController
{
  public function __construct(private readonly YakalaApiClient $client) {}

  /**
   * @return Response
   */
  #[Route("/admin/point_market", name: 'point_market')]
  public function index(Request $request): Response
  {
    // Sayfa numarasını alıyoruz (varsayılan 1)
    $page = (int) $request->query->get('page', 1);
    // Sayfa başına gösterilecek öğe sayısı
    $limit = (int) $request->query->get('example_length', 10);

    // API'ye sayfalı GET isteği gönderiyoruz
    $response = $this->client->get('point_rewards', [
      'query' => [
        'page' => $page,
        'limit' => $limit,
      ]
    ]);

    // JSON verisini alıyoruz
    $data = $response->toArray();
    $rewards = $data['hydra:member'] ?? [];
    $totalItems = $data['hydra:totalItems'] ?? 0;

    // Sayfalama hesaplama
    $totalPages = ceil($totalItems / $limit);

    // Twig'e verileri gönderiyoruz
    return $this->render('admin/pages/point-market/index.html.twig', [
      'rewards' => $rewards,
      'currentPage' => $page,
      'totalPages' => $totalPages,
      'totalItems' => $totalItems,
      'limit' => $limit,  // limit'i de ekliyoruz
    ]);
  }

  #[Route("/admin/point_market/add", name: 'point_market_add_view', methods: ['GET'])]
  public function showAddMarketPage(): Response
  {
    return $this->render('admin/pages/point-market/add.html.twig');
  }


  #[Route("/admin/point_market/add", name: 'point_market_add', methods: ['POST'])]
  public function addMarket(Request $request): Response
  {
    $data = json_decode($request->getContent(), true);

    // Gelen veri eksik mi kontrolü (opsiyonel)
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
    $content = json_decode($response->getContent(false), true); // Hata olsa bile içeriği al

    return $this->json([
      'status' => $status,
      'response' => $content,
      'redirect' => $this->generateUrl('point_market')
    ]);
  }
  #[Route("/admin/point_market/delete/{id}", name: 'app_point_market_delete')]
  public function delete(int $id): JsonResponse
  {
    try {
      $response = $this->client->delete("point_rewards/{$id}");
      $result = $response->toArray();

      if (isset($result['success']) && $result['success']) {
        return new JsonResponse(['success' => true]);
      } else {
        return new JsonResponse(['success' => false], 400);
      }
    } catch (\Exception $e) {
      return new JsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
  }

  #[Route("/admin/point_market/edit/{id}", name: 'point_market_edit_view', methods: ['GET'])]
  public function showEditMarketPage(int $id): Response
  {
    $response = $this->client->get("point_rewards/{$id}");
    $reward = $response->toArray();

    return $this->render('admin/pages/point-market/edit.html.twig', [
      'reward' => $reward,
    ]);
  }

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

    $response = $this->client->patch("point_rewards/{$id}", [
      'headers' => [
        'Content-Type' => 'application/merge-patch+json', 
        'Accept' => 'application/json', 
      ],
      'json' => $data, 
    ]);

    $status = $response->getStatusCode();
    $content = json_decode($response->getContent(false), true); // Hata olsa bile içeriği al

    return $this->json([
      'status' => $status,
      'response' => $content,
      'redirect' => $this->generateUrl('point_market')
    ]);
  }
}
