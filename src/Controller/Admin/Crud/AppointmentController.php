<?php

namespace App\Controller\Admin\Crud;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppointmentController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client){}

    #[Route("/admin/appointment/list",  name: 'app_appointment')]
    public function index(): Response
    {
        return $this->render('admin/pages/appointment/index.html.twig');
    }
}