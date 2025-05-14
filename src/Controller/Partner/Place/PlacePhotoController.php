<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PlacePhotoController extends AbstractPartnerController
{
    #[Route('/partner/photos', name: 'partner_photo', methods: ['GET'])]
    public function index(Request $request): Response
    {
        return $this->render('partner/layouts/video/index.html');
    }
}