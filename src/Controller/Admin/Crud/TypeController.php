<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Type;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class TypeController extends AbstractController
{
    #[Route('/admin/place_type', name: 'place_type')]
    public function place(Request $request): Response
    {
        return $this->render('/admin/pages/type/place.html.twig');
    }

    #[Route('/admin/product_type', name: 'product_type')]
    public function product(Request $request): Response
    {
        return $this->render('/admin/pages/type/product.html.twig');
    }
}