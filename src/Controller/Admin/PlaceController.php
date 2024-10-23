<?php

namespace App\Controller\Admin;

use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PlaceController extends AbstractController implements ControllerInterface
{

    public function getCollection(Request $request): Response
    {
        return $this->render('admin/place/index.html.twig');
    }

    public function edit(Request $request, int|string $id)
    {
        // TODO: Implement edit() method.
    }

    public function add(Request $request)
    {
        // TODO: Implement add() method.
    }

    public function delete(Request $request, int|string $id)
    {
        // TODO: Implement delete() method.
    }
}