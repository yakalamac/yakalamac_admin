<?php

namespace App\Controller\Partner\Place;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
class PlaceReviewController extends AbstractPartnerController
{
    public function __construct(private readonly YakalaApiClient $client)
    {

    }

    #[Route('partner/place/review', name: 'partner_place_review')]
    public function index(): Response{
        return $this->render('/partner/layouts/review/index.html.twig');
    }
}