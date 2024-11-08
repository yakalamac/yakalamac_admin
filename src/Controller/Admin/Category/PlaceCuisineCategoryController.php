<?php

namespace App\Controller\Admin\Category;

use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaceCuisineCategoryController extends AbstractController
{
    #[Route('/admin/category/place/cuisine/list', name: 'app_admin_cuisine_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/place-cuisine-category.html.twig');
    }
}