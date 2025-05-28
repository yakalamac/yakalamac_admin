<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Product;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[Route('/partner/products')]
class ProductRequestController extends AbstractPartnerController
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
    #[Route('/add', name: 'partner_product_add_request', methods: ['POST'])]
    public function add(Request $request): Response
    {
        $this->__init($request);

        if($request->getContentTypeFormat() !== 'json') {
            throw new Exception('Invalid content type provided. ' . $request->getContentTypeFormat());
        }

        $data = $request->toArray();

        if(empty($data['place']) || !is_string($data['place'])) {
            throw new Exception('Invalid place provided.');
        }

        $place = explode('/', $data['place']);
        $place = $place[count($place) - 1];

        $business = $this->user->getBusinessRegistration();

        if(!$business->hasPlace($place) && !$business->hasManagedPlace($place)) {
            throw new Exception('Invalid place provided.');
        }

        $response = $this->client->post('products', ['json' => $data,
            'headers' => ['content-type' => 'application/json']
        ]);


        return $this->client->toResponse($response);
    }

    /**
     * @param Request $request
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/{id}', name: 'partner_product_edit_patch', requirements: ['id' => '^[a-f0-9\-]{36}$'], methods: ['PATCH'])]
    public function edit(Request $request, string $id): Response
    {
        $this->__init($request);

        if(!str_contains($request->headers->get('content-type'), 'json')) {
            throw new Exception('Invalid content type provided.');
        }

        $data = $request->toArray();

        $response = $this->client->patch("products/$id",[
            'json' => $data,
            'headers' => [
                'content-type' => 'application/merge-patch+json'
            ]
        ]);

        return $this->client->toResponse($response);
    }
}