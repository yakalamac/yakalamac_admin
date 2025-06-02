<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Index;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/partner')]
class PartnerController extends AbstractController
{
    /**
     * @return Response
     */
    #[Route('/dashboard', name: 'partner_dashboard')]
    #[Route('/', name: 'partner_index')]
    public function dashboard(): Response
    {
        return $this->render('partner/layouts/dashboard.html.twig');
    }

    /**
     * @return Response
     */
    #[Route('/analysis', name: 'partner_analysis')]
    public function analysis(): Response
    {
        return new Response();
    }
}