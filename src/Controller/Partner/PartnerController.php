<?php

namespace App\Controller\Partner;

use App\Service\PlaceService;
use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;
use App\Controller\API\ApiController;
use App\Http\ClientFactory;


class PartnerController extends AbstractController
{

    public function __construct()
    {
       
    }

    #[Route('/partner', name: 'partner_dashboard')]
    public function index(Request $request): Response
    {
        return $this->render('partner/layouts/dashboard.html.twig');
    }

}
