<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

use App\Http\Defaults;
use App\Interface\ControllerInterface;
use App\Service\PlaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class PlaceController extends AbstractController implements ControllerInterface
{

    /**
     * @param PlaceService $placeService
     */
    public function __construct(private readonly PlaceService $placeService)
    {
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/places', name: 'app_admin_places_list', methods: ['GET'])]
    public function getCollection(Request $request): Response
    {
        return $this->render('admin/place/index.html.twig');
        /**
         * ,
         * [
         * 'places' => json_decode(
         * $this->placeService
         * ->getPlaces(
         * $request->query->get(Defaults::QUERY_PAGE) ?? 1,
         * $request->query->get(Defaults::QUERY_PAGINATION) ?? Defaults::PAGINATION_SIZE
         * )
         * ->getContent(),
         * true
         * )
         * ]
         */
    }

    /**
     * @param Request $request
     * @param int|string $id
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/admin/places/{id}', name: 'app_admin_places_edit', methods: ['GET'])]
    public function edit(Request $request, int|string $id): Response
    {
        return $this->render(
            'admin/pages/place/edit-place.html.twig',
            [
                'place' => json_decode(
                    $this->placeService
                        ->getPlace($id)
                        ->getContent(),
                    true
                )
            ]
        );
    }

    public function add(Request $request)
    {
        // TODO: Implement add() method. NOT IN USE
    }

    public function delete(Request $request, int|string $id)
    {
        // TODO: Implement delete() method. NOT IN USE
    }
}