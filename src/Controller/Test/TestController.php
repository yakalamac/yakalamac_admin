<?php

namespace App\Controller\Test;

use App\Service\PlaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


class TestController extends AbstractController
{
    public function __construct(private PlaceService $placeService)
    {
    }

    #[Route('/test/controller', name: 'app_test_controller')]
    public function index(): Response
    {

        return $this->render(
            'admin/pages/place/edit-place.html.twig',
            [
                'place' => json_decode(
                    $this->placeService
                        ->getPlace('fed7f4e2-4ce0-4ee1-bbd2-d55749ad8b8b')
                        ->getContent(),
                    true
                )
            ]
        );
    }
}
