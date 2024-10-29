<?php

namespace App\Controller\Admin\Type;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaceTypeController extends AbstractController
{
    #[Route('/place_type', name: 'app_admin_place_type')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/type/place.html.twig');
    }
}