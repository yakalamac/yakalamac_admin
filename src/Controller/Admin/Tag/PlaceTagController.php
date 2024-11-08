<?php

namespace App\Controller\Admin\Tag;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaceTagController extends AbstractController
{
    #[Route('/place_tag', name: 'app_admin_place_tag')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/tag/place.html.twig');
    }
}