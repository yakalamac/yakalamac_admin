<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin/categories')]
class CategoryController extends BaseController
{
    /**
     * @return Response
     */
    #[Route('/contact', name: 'contact_category')]
    public function contact(): Response
    {
        return $this->render('admin/pages/category/contact-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/account', name: 'account_category')]
    public function account(): Response
    {
        return $this->render('admin/pages/category/place-account-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/place', name: 'place_category')]
    public function place(): Response
    {
        return $this->render('admin/pages/category/place-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/concept', name: 'concept_category')]
    public function concept(): Response
    {
        return $this->render('admin/pages/category/place-concept-category.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/cuisine', name: 'cuisine_category')]
    public function cuisine(): Response
    {
        return $this->render('admin/pages/category/place-cuisine-category.html.twig');
    }

    #[Route('/photo', name: 'photo_category')]
    public function photo(): Response
    {
        return $this->render('admin/pages/category/place-photo-category.html.twig');
    }

    #[Route('/product', name: 'product_category')]
    public function product(): Response
    {
        return $this->render('admin/pages/category/product-category.html.twig');
    }

    #[Route('/source', name: 'source_category')]
    public function source(): Response
    {
        return $this->render('admin/pages/category/source-category.html.twig');
    }
}