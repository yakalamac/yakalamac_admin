<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_MANAGER")]
#[Route('/admin/tags')]
class TagController extends BaseController
{
    #[Route('/place_tag', name: 'place_tag')]
    public function place(Request $request): Response
    {
        return $this->render('admin/pages/tag/place.html.twig');
    }

    #[Route('/product', name: 'product_tag')]
    public function product(Request $request): Response
    {
        return $this->render('admin/pages/tag/product.html.twig');
    }
}