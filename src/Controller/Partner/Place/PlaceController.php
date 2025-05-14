<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class PlaceController extends AbstractPartnerController
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
    #[Route('/partner/place', name: 'partner_place', methods: ['GET'])]
    public function index(Request $request): Response
    {
        if(NULL === $place = $this->getActivePlace($request)) {
            return $this->redirect(
                $request->headers->get('referer', '/partner')
            );
        }

        $place = $this->client->get("places/$place");

        return $this->render('/partner/layouts/place/index.html.twig', [
            'place' => $this->client->toArray($place)
        ]);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/partner/place', name: 'partner_place_patch', methods: ['PATCH'])]
    public function patch(Request $request): Response
    {
        $format = $request->headers->get('content-type');

        if(!str_contains($format, 'json')) {
            throw new Exception('Invalid content type provided. ' . $format);
        }

        if(NULL === $place = $this->getActivePlace($request)) {
            return $this->redirect(
                $request->headers->get('referer', '/partner')
            );
        }

        $data = $request->toArray();

        $place = $this->client->patch("places/$place",[
            'json' => $data,
            'headers' => [
                'content-type' => 'application/merge-patch+json'
            ]
        ]);

        return $this->client->toResponse($place);
    }
}