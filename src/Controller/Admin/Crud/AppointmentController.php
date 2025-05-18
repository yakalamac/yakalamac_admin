<?php

namespace App\Controller\Admin\Crud;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppointmentController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client){}

    #[Route("/admin/appointment/list",  name: 'app_appointment')]
    public function index(): Response
    {
        //throw new \Exception('girdim');
        return $this->render('admin/pages/appointment/index.html.twig');
    }
}