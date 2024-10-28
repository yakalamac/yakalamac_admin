<?php

namespace App\Controller\Admin;

use App\Interface\ControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MenuController extends AbstractController implements ControllerInterface
{

    public function index(Request $request): Response
    {
        // TODO: Implement index() method.
    }

    public function edit(Request $request, int|string $id): Response
    {
        // TODO: Implement edit() method.
    }

    public function add(Request $request): Response
    {
        // TODO: Implement add() method.
    }

    public function delete(Request $request, int|string $id): Response
    {
        // TODO: Implement delete() method.
    }
}