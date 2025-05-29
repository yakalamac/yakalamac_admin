<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
#[Route('/admin/types')]
class TypeController extends AbstractController
{
    /**
     * @return Response
     */
    #[Route('/place', name: 'place_type')]
    public function place(): Response
    {
        return $this->render('/admin/pages/type/place.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/product', name: 'product_type')]
    public function product(): Response
    {
        return $this->render('/admin/pages/type/product.html.twig');
    }
}