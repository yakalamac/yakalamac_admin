<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted("ADMIN_ENTITY_VIEWER")]
class CategoryController extends BaseController
{
    /**
     * @return Response
     */
    #[Route('/admin/category/contact/list', name: 'contact_category')]
    public function contact(): Response
    {
        return $this->render('admin/pages/category/contact-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/place_account_category', name: 'place_account_category')]
    public function account(): Response
    {
        return $this->render('admin/pages/category/place-account-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/admin/category/place/list', name: 'place_category')]
    public function place(): Response
    {
        return $this->render('admin/pages/category/place-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/admin/category/place/concept/list', name: 'concept_category')]
    public function concept(): Response
    {
        return $this->render('admin/pages/category/place-concept-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/admin/category/place/cuisine/list', name: 'cuisine_category')]
    public function cuisine(): Response
    {
        return $this->render('admin/pages/category/place-cuisine-category.html.twig');
    }

    #[Route('/admin/category/photo/list', name: 'place_photo_category')]
    public function photo(): Response
    {
        return $this->render('admin/pages/category/place-photo-category.html.twig');
    }

    #[Route('/admin/category/product/list', name: 'product_category')]
    public function product(): Response
    {
        return $this->render('admin/pages/category/product-category.html.twig');
    }

    #[Route('/admin/category/source/list', name: 'source_category')]
    public function source(): Response
    {
        return $this->render('admin/pages/category/source-category.html.twig');
    }
}