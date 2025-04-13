<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Crud\Product;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/partner')]
class ProductController extends BaseController
{
    /**
     * @return Response
     */
    #[Route('/products', name: 'partner_product_list', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('partner/layouts/product/index.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/products/add', name: 'partner_product_add', methods: ['GET'])]
    public function add(): Response
    {
        return $this->render('partner/layouts/product/add.html.twig');

    }

    /**
     * @return void
     */
    #[Route('/products/bulk', name: 'partner_product_bulk')]
    public function bulk()
    {

    }

    /**
     * @return void
     */
    #[Route('/products/util', name: 'partner_product_util')]
    public function util()
    {

    }
}