<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Promotion\Campaign;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use App\Utils\DatatableContent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[Route('/partner/campaigns/custom')]
class CustomCampaignController extends AbstractPartnerController
{
    public function __construct(private readonly YakalaApiClient $client) {}

    #[Route(name: 'partner_campaign_custom', methods: ['GET'])]
    public function index(Request $request): Response
    {
        // TODO
        if(NULL === $place = $this->getActivePlace($request)) {
            $path = $request->headers->get('referer', '/partner');
            return $this->redirect($path);
        }

        //$this->client->get();

        return $this->render('partner/layouts/campaign/custom/index.html.twig');
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/list', name: 'partner_campaign_custom_list', methods: ['GET'])]
    public function campaigns(Request $request): Response
    {
        if(NULL === $place = $this->getActivePlace($request)) {
            $path = $request->headers->get('referer', '/partner');
            return $this->redirect($path);
        }

        // Get all form content
        $content = $request->request->all();

        if(!DatatableContent::isDatatableContent($content)) {
            return $this->json([
                'message' => 'Invalid data type, expected datatable request content.',
                'status' => Response::HTTP_BAD_REQUEST
            ], Response::HTTP_BAD_REQUEST);
        }

        $data = new DatatableContent($content);

        $response = $this->client->get("campaigns/scope/custom/$place", [
            'headers' => [
                'accept' => 'application/ld+json'
            ],
            'query' => [
                'limit' => $length = $data->getLength(),
                'page' => ($data->getStart()/$length) + 1
            ]
        ]);

        $response = $this->client->toResponseArray($response);

        if($response['content'] !== NULL) {
            $response['content']['draw'] = $data->getDraw();
        }

        return $this->client->toResponseFromArray($response);
    }
}