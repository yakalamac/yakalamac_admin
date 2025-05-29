<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PlaceVideoController extends AbstractPartnerController
{
    /**
     * @return Response
     */
    #[Route('/partner/place/videos', name: 'partner_place_video', methods: ['GET'])]
    public function index(): Response
    {
       return $this->render('partner/layouts/video/index.html.twig');
    }
}