<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

use App\Interface\ControllerInterface;
use App\Service\API\PlaceService;
use App\Service\API\ProductService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ProductController extends AbstractController implements ControllerInterface
{

    public function __construct(
        private readonly ProductService $productService,
        private readonly PlaceService $placeService
    ) {}

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/product/list', name: 'app_admin_product_index')]
    #[IsGranted("ADMIN_ENTITY_VIEWER")]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/product/index.html.twig');
    }

    /**
     * @param Request $request
     * @param int|string $id
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route(
        '/admin/product/{id}',
        name: 'app_admin_product_edit',
        requirements: ['id' => '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}'])
    ]
    #[IsGranted("ADMIN_ENTITY_EDITOR")]
    public function edit(Request $request, int|string $id): Response
    {
        $response = $this->productService->getProduct($id);
        $product = json_decode($response->getContent(),true);
        if ($response->getStatusCode() !== 200) {
            throw new Exception("Product not found.");
        }
        
        $place = $this->placeService->getPlace($product['_source']['place']);

        return $this->render(
            'admin/pages/product/edit.html.twig',
            [
                'product' => $product,
                'place' => json_decode(
                    $place->getContent(),
                    true
                )
            ]
        );
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/product/add', name: 'app_admin_product_add')]
    #[IsGranted("ADMIN_ENTITY_EDITOR")]
    public function add(Request $request): Response
    {
        return $this->render('admin/pages/product/add.html.twig');
    }
}