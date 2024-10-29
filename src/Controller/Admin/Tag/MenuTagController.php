<?php

namespace App\Controller\Admin\Tag;

use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MenuTagController extends AbstractController
{
    #[Route('/menu_tag', name: 'app_admin_menu_tag')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/tag/menu.html.twig');
    }
}