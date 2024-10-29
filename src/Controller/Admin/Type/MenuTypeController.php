<?php

namespace App\Controller\Admin\Type;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MenuTypeController extends AbstractController
{
    #[Route('/menu_type', name: 'app_admin_menu_type')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/type/menu.html.twig');
    }
}