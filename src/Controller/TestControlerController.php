<?php

namespace App\Controller;

use App\Service\PlaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


class TestControlerController extends AbstractController
{
    public function __construct(private PlaceService $placeService)
    {
    }

    #[Route('/test/controler', name: 'app_test_controler_controller')]
    public function index(): Response
    {

        return $this->render('admin/pages/place/edit-place.html.twig', [
            'place' => json_decode($this->placeService->getPlace('fed7f4e2-4ce0-4ee1-bbd2-d55749ad8b8b')->getContent(), true),
            'categories' => [
                [
                    'name' => 'Kategori 1',
                    'description' => 'Kategori 1',
                    'id' => 1
                ],
                [
                    'name' => 'Kategori 3',
                    'description' => 'Kategori 3',
                    'id' => 3
                ],
                [
                    'name' => 'Kategori 2',
                    'description' => 'Kategori 2',
                    'id' => 2
                ]
            ]
        ]);
    }
}
