<?php

namespace App\Controller\Admin\Type;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductTypeController extends AbstractController
{
    #[Route('/product_type', name: 'app_admin_product_type')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/type/product.html.twig');
    }
}