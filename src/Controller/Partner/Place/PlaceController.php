<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Place;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
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
}