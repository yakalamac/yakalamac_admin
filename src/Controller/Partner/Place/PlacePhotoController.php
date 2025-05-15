<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PlacePhotoController extends AbstractPartnerController
{
    public function __construct(private readonly YakalaApiClient $client)
    {
    }

    #[Route('/partner/place/photo', name: 'partner_place_photo', methods: ['GET'])]
    public function index(Request $request): Response
    {
        return $this->render('/partner/layouts/photo/index.html.twig');
    }
}