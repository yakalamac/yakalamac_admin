<?php

namespace App\Controller\Admin\Category;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class PlaceAccountCategoryController extends AbstractController
{

    #[Route('/place_account_category', name: 'app_admin_place_account_category')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/category/place-account-category.html.twig');
    }
}
