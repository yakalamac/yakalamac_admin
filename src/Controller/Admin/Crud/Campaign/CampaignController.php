<?php

namespace App\Controller\Admin\Crud\Campaign;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CampaignController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client){}
    #[Route('/admin/campaign', name: 'campaign')]
    public function index(): Response
    {
        return $this->render('admin/pages/campaigns/index.html.twig');
    }

    #[Route('/admin/campaign/detail/{id}', name: 'admin_campaign_detail')]
    public function edit(): Response{

        return $this->render('admin/pages/campaigns/edit.html.twig');
    }

    #[Route('/admin/campaign/add', name: 'admin_campaign_add')]
    public function add(): Response
    {
        return $this->render('admin/pages/campaigns/add.html.twig');
    }
}