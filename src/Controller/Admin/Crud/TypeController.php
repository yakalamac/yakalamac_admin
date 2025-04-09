<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
#[Route('/admin/types')]
class TypeController extends AbstractController
{
    #[Route('/place', name: 'place_type')]
    public function place(Request $request): Response
    {
        return $this->render('/admin/pages/type/place.html.twig');
    }

    #[Route('/product', name: 'product_type')]
    public function product(Request $request): Response
    {
        return $this->render('/admin/pages/type/product.html.twig');
    }
}