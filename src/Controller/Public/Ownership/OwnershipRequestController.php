<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public\Ownership;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class OwnershipRequestController extends BaseController
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
    #[Route(path: '/ownership/verify', name: 'app_public_ownership_verify', methods: ['POST'])]
    public function verificate(Request $request): Response
    {
        if($request->getContentTypeFormat() !== 'json') {
            throw new Exception('Invalid content type provided');
        }

        $orequest = $request->getSession()->get('ownership_request');

        if($orequest === NULL) {
            throw new Exception('Invalid ownership request');
        }

        $data = $request->toArray();

        $response = $this->client->post('appoinments/validate', [
            'json' => [
                'appoinmentKey' => $orequest,
                'appoinmentValue' => $data['verificationCode'] ?? throw new Exception('Invalid verification code provided'),
                'type' => $data['type'] ?? throw new Exception('Invalid type provided')
            ]
        ]);

        // todo
        return $this->client->toResponse($response);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route(path: '/ownership/start', name: 'app_public_ownership_verificate', methods: ['POST'])]
    public function start(Request $request): Response
    {
        if($request->getContentTypeFormat() !== 'json') {
            throw new Exception('Invalid content type provided');
        }

        $data = $request->toArray();

        $result = $this->client->post('appointments', [
            'json' => $data,
            'headers' => ['content-type' => 'application/json']
        ]);

        if($this->client->isSuccess($result)) {
            $array = $this->client->toArray($result);

            if(!empty($array['appoinmentKey'])) {
                $request->getSession()->set('ownership_request', $array['appoinmentKey']);
            }
        }

        return $this->client->toResponse($result);
    }
}