<?php

namespace App\Controller\Admin\Category;
use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ItemCategoryController extends AbstractController implements ControllerInterface
{
    #[Route('/item_category', name: 'item_category')]
    public function index(Request $request): Response
    {
        // $user = $this->getUserOrRedirect($request);
        // if ($user instanceof RedirectResponse) {
        //     return $user;
        // }


        return $this->render('admin/pages/category/item-category.html.twig', [
            // 'user' => $user,
        ]);
    }

    public function edit(Request $request, int|string $id): Response
    {
        // TODO: Implement edit() method.
    }

    public function add(Request $request): Response
    {
        // TODO: Implement add() method.
    }
}