<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

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
    #[Route('/admin/place/list', name: 'app_admin_place_index', methods: ['GET'])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/place/index.html.twig');
    }

    
    #[Route('/admin/place/add', name: 'app_admin_place_add', methods: ['GET'])]
    public function add(Request $request): Response
    {
        return $this->render('admin/pages/place/add.html.twig');
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
    #[Route('/admin/place/{id}', name: 'app_admin_place_edit', methods: ['GET'])]
    public function edit(Request $request, int|string $id): Response
    {
        return $this->render(
            'admin/pages/place/edit.html.twig',
            [
                'place' => json_decode(
                    $this->placeService
                        ->getPlace($id)
                        ->getContent(),
                    true
                ),
                'openingHours' => json_decode(
                    $this->placeService
                        ->getOpeningHours($id)
                        ->getContent(),
                        true
                ),
                'sources' => json_decode(
                    $this->placeService
                        ->getSources($id)
                        ->getContent(),
                        true
                ),
                'accounts' => json_decode(
                    $this->placeService
                        ->getAccounts($id)
                        ->getContent(),
                        true
                ),
                'contactCategories' => json_decode(
                    $this->placeService
                        ->getContactCategories()
                        ->getContent(),
                        true
                ),
                'accountsCategories' => json_decode(
                    $this->placeService
                        ->getAccountCategories()
                        ->getContent(),
                        true
                ),
                'sourcesCategories' => json_decode(
                    $this->placeService
                        ->getSourceCategories()
                        ->getContent(),
                        true
                ),
                
            ]
        );
    }

}