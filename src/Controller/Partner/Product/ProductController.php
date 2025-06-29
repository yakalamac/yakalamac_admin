<?php

/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Product;

use App\Client\YakalaApiClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Client\ElasticaClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Throwable;
use App\Service\ProductService;

#[Route('/partner/products')]
class ProductController extends AbstractPartnerController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(
        private readonly YakalaApiClient $client,
        private readonly ElasticaClient $elastica,
        private readonly ProductService $productService,
    ) {}

    /**
     * @return Response
     */
    #[Route(name: 'partner_product_list', methods: ['GET'])]
    public function index(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);
        $products = $this->productService->getProductsByPlaceId($placeId);
        $productCategories = $this->productService->getProductCategories();
        $productGroups = $this->productService->getProductGroups($placeId);
        $groupedProducts = [];

        foreach ($productGroups as $group) {
            $groupedProducts[$group['title']] = [
                'id' => $group['id'],
                'priority' => $group['priority'],
                'category' => $group['category'],
                'items' => $group['products'] ?? []
            ];
        }

        if (!isset($groupedProducts['default'])) {
            $groupedProducts['default'] = [
                'id' => null,
                'priority' => 0,
                'category' => null,
                'items' => []
            ];
        }

        foreach ($products as $product) {
            if ($product['group']) {
                $groupedProducts[$product['group']['title']]['items'][] = $product;
            } else {
                $groupedProducts['default']['items'][] = $product;
            }
        }

        return $this->render('partner/layouts/product/index.html.twig', [
            'groupedProducts' => $groupedProducts,
            'categories' => $productCategories,
            'groups' => $productGroups
        ]);
    }

    /**
     * @return Response
     * @throws Throwable
     */
    #[Route('/add', name: 'partner_product_add', methods: ['GET', 'POST'])]
    public function add(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            try {
                $productData = json_decode($request->request->get('productData'), true);
                
                if (!$productData) {
                    return new JsonResponse([
                        'success' => false,
                        'message' => 'Invalid product data'
                    ], 400);
                }
                
                $photo = $request->files->get('photo');
                if (!$photo) {
                    return new JsonResponse([
                        'success' => false,
                        'message' => 'No photo uploaded'
                    ], 400);
                }

                $productCreateResponse = $this->productService->createProduct($productData);
                
                if (isset($productCreateResponse['id'])) {
                    $productId = $productCreateResponse['id'];
                    
                    $photoUploadResponse = $this->productService->uploadProductPhoto($productId, $photo);
                    
                    return new JsonResponse([
                        'success' => true,
                        'id' => $productId,
                        'data' => $productCreateResponse,
                        'photo' => $photoUploadResponse
                    ]);
                } else {
                    return new JsonResponse([
                        'success' => false,
                        'message' => 'Product created but could not get product ID'
                    ], 500);
                }
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 500);
            }
        }
        
        return $this->render('partner/layouts/product/add.html.twig');
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/{id}', name: 'partner_product_edit', requirements: ['id' => '^[a-f0-9\-]{36}$'], methods: ['GET', 'POST'])]
    public function edit(string $id, Request $request): Response
    {
        if ($request->isMethod('POST')) {
            try {
                $productData = json_decode($request->request->get('productData'), true);
                
                if (!$productData) {
                    return new JsonResponse([
                        'success' => false,
                        'message' => 'Invalid product data'
                    ], 400);
                }
                
                $productUpdateResponse = $this->productService->updateProduct($id, $productData);
                
                $photo = $request->files->get('photo');
                if ($photo) {
                    $photoUploadResponse = $this->productService->uploadProductPhoto($id, $photo);
                    
                    return new JsonResponse([
                        'success' => true,
                        'id' => $id,
                        'data' => $productUpdateResponse,
                        'photo' => $photoUploadResponse
                    ]);
                }
                
                return new JsonResponse([
                    'success' => true,
                    'id' => $id,
                    'data' => $productUpdateResponse,
                    'message' => 'Product updated successfully without changing photo'
                ]);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 500);
            }
        }
        
        $response = $this->client->get("products/$id");

        return $this->render('partner/layouts/product/edit.html.twig', [
            'product' => $this->client->toArray($response)
        ]);
    }

    /**
     * @return Response
     * @throws Throwable
     */
    #[Route('/bulk', name: 'partner_product_bulk', methods: ['GET'])]
    public function bulk(): Response
    {
        return $this->render('partner/layouts/product/edit.html.twig');
    }

    /**
     * @return Response
     * @throws Throwable
     */
    #[Route('/complementary', name: 'partner_product_complementary', methods: ['GET'])]
    public function util(): Response
    {
        return $this->render('partner/layouts/complementary/index.html.twig');
    }

    #[Route('/group', name: 'partner_product_group_create', methods: ['POST'])]
    public function createGroup(Request $request): Response
    {
        $name = $request->request->get('name');
        $categoryId = $request->request->get('category');
        $description = $request->request->get('description');
        $placeId = $this->getActivePlace($request);

        $response = $this->productService->createGroup(
            $placeId,
            $name,
            $description,
            $categoryId
        );

        return new JsonResponse([
            'success' => true,
            'data' => $response,
        ], 200);
    }

    #[Route('/group/changes', name: 'partner_product_group_update', methods: ['POST'])]
    public function handleGroupChanges(Request $request): Response
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return new JsonResponse([
                'error' => 'Invalid content type, JSON expected'
            ], 400);
        }


        try {
            $data = $request->toArray();
            $groups = $data['groups'] ?? [];

            $this->validateGroups($groups);

            foreach ($groups as $group) {
                if ($group['isNew']) {
                    $placeId = $this->getActivePlace($request);
                    $this->productService->createGroup(
                        $placeId,
                        $group['name'],
                        $group['description'] ?? null,
                        $group['category'] ?? null
                    );
                } else {
                    $this->productService->updateGroup(
                        $group['id'],
                        (int) $group['order'],
                        $group['name'],
                        $group['description'] ?? null,
                        $group['category'] ?? null
                    );
                }
            }

            return new JsonResponse(['success' => true, 'message' => 'Groups updated successfully'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    #[Route('/order/save', name: 'partner_product_order_save', methods: ['POST'])]
    public function saveProductOrder(Request $request): Response
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return new JsonResponse([
                'error' => 'Invalid content type, JSON expected'
            ], 400);
        }

        try {
            $data = $request->toArray();
            $changes = $data['changes'] ?? [];
            $results = [];

            foreach ($changes as $change) {
                $type = $change['type'] ?? '';

                switch ($type) {
                    case 'order':
                        $results[] = $this->productService->updateProductOrder(
                            $change['productId'],
                            $change['categoryId'],
                            $change['position']
                        );
                        break;

                    case 'category':
                        $results[] = $this->productService->moveProductToGroup(
                            $change['productId'],
                            $change['toCategoryId']
                        );
                        break;

                    case 'status':
                        $isAvailable = $change['status'] === 'available';
                        $results[] = $this->productService->updateProductStatus(
                            $change['productId'],
                            $isAvailable
                        );
                        break;

                    case 'categoryOrder':
                        $results[] = $this->productService->updateCategoryOrder($change['order']);
                        break;

                    default:
                        break;
                }
            }

            return new JsonResponse([
                'success' => true,
                'message' => 'Product order updated successfully',
                'results' => $results
            ], 200);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    private function validateGroups(array $groups): void
    {
        if (empty($groups)) {
            throw new \Exception('No groups provided');
        }

        foreach ($groups as $group) {
            if (!isset($group['id']) || empty($group['id'])) {
                throw new \Exception('Group ID is required');
            }

            if (!isset($group['name']) || empty($group['name'])) {
                throw new \Exception('Group name is required');
            }

            if (!isset($group['order']) || !is_numeric($group['order'])) {
                throw new \Exception('Valid order number is required');
            }
        }
    }
}
