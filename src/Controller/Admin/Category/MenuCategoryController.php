<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class MenuCategoryController extends AbstractController
{
    #[Route('/admin/category/menu/list', name: 'app_admin_menu_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/menu-category.html.twig');
    }
}