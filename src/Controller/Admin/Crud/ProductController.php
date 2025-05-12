<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Client\YakalaApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Throwable;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class ProductController extends AbstractController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/products', name: 'products')]
    public function index(Request $request): Response
    {
        $products = $this->client->get('products', [
            'query' => [
                'limit' => $request->get('size', 15),
                'page' => $request->get('page', 1)
            ]
        ]);

        return $this->render('/admin/pages/product/index.html.twig', [
            'products' => $products
        ]);
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/products/{id}', name: 'product_detail')]
    public function edit(string $id): Response
    {
        return $this->render(
            '/admin/pages/product/edit.html.twig', [
                'product' => $this->client->toArray($this->client->get("products/$id"))
            ]
        );
    }

    /**
     * @return Response
     */
    #[Route('/admin/product/add', name: 'product_add')]
    public function add(): Response
    {
        return $this->render('/admin/pages/product/add.html.twig');
    }
}