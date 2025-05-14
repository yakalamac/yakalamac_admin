<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Promotion\Campaign;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

#[Route('/partner/campaigns/yakala')]
class YakalaCampaignController extends AbstractPartnerController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route(name: 'partner_campaign_yakala')]
    public function index(Request $request): Response
    {
        $parameters = [];

        $campaigns = $this->getCampaigns($request);

        if($this->client->isSuccess($campaigns)) {
            $parameters['initial'] = $this->client->toArray($campaigns);
        }

        return $this->render('partner/layouts/campaign/yakala/index.html.twig',$parameters);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/list', name: 'partner_campaign_yakala_list', methods: ['POST', 'GET'])]
    public function campaigns(Request $request): Response
    {
        $response = $this->getCampaigns($request);
        return $this->client->toResponse($response);
    }

    /**
     * @param Request $request
     * @param string $campaignId
     * @return Response
     * @throws Throwable
     */
    #[Route('/list/{campaignId}/products', name: 'partner_campaign_yakala_list_products', methods: ['POST', 'GET'])]
    public function campaignProducts(Request $request, string $campaignId): Response
    {
        $response = $this->getCampaignProducts($request, $campaignId);
        return $this->client->toResponse($response);
    }

    /**
     * @param Request $request
     * @return Throwable|ResponseInterface
     */
    private function getCampaigns(Request $request): Throwable|ResponseInterface
    {
        $place = $this->getActivePlace($request);

        if(
            $place === NULL &&
            NULL === $place = $this->user
                ->getBusinessRegistration()
                ->getFirstPlace()?->getName()
        ) { return new \Exception('Active place not found.', 404); }

        $data = $this->extractData($request);

        return $this->client->get("campaigns/scope/yakala/filter/$place", [
            'headers' => [
                'accept' => 'application/ld+json'
            ],
            'query' => [
                'limit' => $data['size'] ?? 15,
                'page' => $data['page'] ?? 1
            ]
        ]);
    }

    /**
     * @param Request $request
     * @param string $campaignId
     * @return Throwable|ResponseInterface
     */
    private function getCampaignProducts(Request $request, string $campaignId): Throwable|ResponseInterface
    {
        $place = $this->getActivePlace($request);

        if(
            $place === NULL &&
            NULL === $place = $this->user
                ->getBusinessRegistration()
                ->getFirstPlace()?->getName()
        ) { return new \Exception('Active place not found.', 404); }

        $data = $this->extractData($request);

        return $this->client->post("campaigns/yakala/filter/products", [
            'headers' => [
                'accept' => 'application/ld+json',
                'content-type' => 'application/ld+json'
            ],
            'json' => [
                'campaignId' => $campaignId,
                'placeId' => $place,
                'limit' => $data['size'] ?? 15,
                'page' => $data['page'] ?? 1
            ]
        ]);
    }
}
/*
    use App\Utils\DatatableContent;
    if(!DatatableContent::isDatatableContent($content)) {
        return $this->json([
            'message' => 'Invalid data type, expected datatable request content.',
            'status' => Response::HTTP_BAD_REQUEST
        ], Response::HTTP_BAD_REQUEST);
    }

    $data = new DatatableContent($content);

    $response = $this->client->get("campaigns/scope/yakala/filter/$place",[
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
 */