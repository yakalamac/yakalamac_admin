<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class PlaceConceptCategoryController extends AbstractController
{
    #[Route('/admin/category/place/concept/list', name: 'app_admin_concept_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/place-concept-category.html.twig');
    }
}