<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Place;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Throwable;

#[IsGranted(("ADMIN_ENTITY_VIEWER"))]
class PlaceController extends BaseController
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
    #[Route('/places', name: 'places')]
    public function index(Request $request): Response
    {
        /* TODO
        $places = $this->client->get("/api/places", [
            'query'=>[
                'limit'=> $request->query->get('size', 15),
                'page' => $request->query->get('page', 1),
            ]
        ]);

        return $this->render('/admin/pages/place/index.html.twig', ['places' => $this->client->toArray($places)]);
        TODO
        */
        return $this->render('/admin/pages/place/index.html.twig');
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/places/{id}', name: 'place_detail')]
    public function detail(string $id): Response
    {
        return $this->render('/admin/pages/place/edit.html.twig', [
            'place' => $this->client->toArray(
                $this->client->get("/api/places/$id")
            ),
            ''
        ]);
    }

    /**
     * @return Response
     */
    #[Route('/places/add', name: 'place_add')]
    public function add(): Response
    {
        return $this->render('/admin/pages/place/add.html.twig');
    }
}