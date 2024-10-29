<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SourceCategoryController extends AbstractController
{
    #[Route('/admin/category/source/list', name: 'app_admin_source_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/source-category.html.twig');
    }
}