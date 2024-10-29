<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductCategoryController extends AbstractController
{
    #[Route('/admin/category/product/list', name: 'app_admin_product_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/product-category.html.twig');
    }
}