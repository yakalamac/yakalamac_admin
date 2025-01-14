<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class PlacePhotoCategoryController extends AbstractController
{
    #[Route('/admin/category/place/photo/list', name: 'app_admin_place_photo_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/place-photo-category.html.twig');
    }
}
