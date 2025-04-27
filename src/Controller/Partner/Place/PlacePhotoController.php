<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PlacePhotoController extends AbstractPartnerController
{
    public function index(Request $request): Response
    {
        return $this->render('partner/layouts/video/index.html');
    }
}