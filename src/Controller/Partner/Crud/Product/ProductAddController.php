<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Crud\Product;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[Route('/partner/products/{id}', name: 'partner_product_edit')]
class ProductAddController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route(methods: ['GET'])]
    public function index(string $id): Response
    {
        $response = $this->client->get("products/$id");

        return $this->render('partner/layouts/product/edit.html.twig', [
            'product' => $this->client->toArray($response)
        ]);
    }

    #[Route(methods: ['POST'])]
    public function update(Request $request, string $id): Response
    {

    }
}