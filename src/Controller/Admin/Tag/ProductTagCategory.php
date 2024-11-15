<?php

namespace App\Controller\Admin\Tag;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductTagCategory extends AbstractController
{
    #[Route('/admin/product_tag', name: 'app_admin_product_tag')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/tag/product.html.twig');
    }
}