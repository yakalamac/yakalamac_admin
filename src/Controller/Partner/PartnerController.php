<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class PartnerController extends AbstractController
{
    #[Route('/partner', name: 'partner_dashboard')]
    public function index(Request $request): Response
    {
        return $this->render('partner/layouts/dashboard.html.twig');
    }

}
