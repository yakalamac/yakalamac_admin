<?php

namespace App\Controller\Admin\Type;
use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductTypeController extends AbstractController implements ControllerInterface
{
    #[Route('/product_type', name: 'product_type')]
    public function index(Request $request): Response
    {
        // $user = $this->getUserOrRedirect($request);
        // if ($user instanceof RedirectResponse) {
        //     return $user;
        // }


        return $this->render('admin/pages/type/product.html.twig', [
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