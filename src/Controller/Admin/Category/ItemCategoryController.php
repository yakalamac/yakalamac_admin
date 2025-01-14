<?php

namespace App\Controller\Admin\Category;

use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class ItemCategoryController extends AbstractController
{
    #[Route('/admin/category/item/list', name: 'app_admin_item_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/item-category.html.twig');
    }
}