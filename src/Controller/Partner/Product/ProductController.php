<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Product;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[Route('/partner/products')]
class ProductController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @return Response
     */
    #[Route(name: 'partner_product_list', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('partner/layouts/product/index.html.twig');
    }

    /**
     * @return Response
     * @throws Throwable
     */
    #[Route('/add', name: 'partner_product_add', methods: ['GET'])]
    public function add(): Response
    {
        return $this->render('partner/layouts/product/add.html.twig');
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/{id}', name: 'partner_product_edit', requirements: ['id' => '^[a-f0-9\-]{36}$'], methods: ['GET'])]
    public function edit(string $id): Response
    {
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
}