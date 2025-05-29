<?php
/**
 * @author Barış Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud\Campaign;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class CampaignController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @return Response
     */
    #[Route('/admin/campaign', name: 'campaign')]
    public function index(): Response
    {
        return $this->render('admin/pages/campaigns/index.html.twig');
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/admin/campaign/detail/{id}', name: 'admin_campaign_detail')]
    public function edit(string $id): Response
    {
        $response = $this->client->get("campaigns/scope/yakala/filter/$id");

        $response = $this->client->toArray($response);

        return $this->render('admin/pages/campaigns/edit.html.twig',[
            'yakala' => $response['hydra:member'] ?? [],
        ]);
    }

    /**
     * @return Response
     */
    #[Route('/admin/campaign/add', name: 'admin_campaign_add')]
    public function add(): Response
    {
        return $this->render('admin/pages/campaigns/add.html.twig');
    }
}