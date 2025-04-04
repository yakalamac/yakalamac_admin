<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin;

use App\Interface\ControllerInterface;
use App\Service\API\PlaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[IsGranted(("ADMIN_ENTITY_VIEWER"))]
class PlaceController extends AbstractController implements ControllerInterface
{
    private ?string $googlePlacesApiKey;
    private ?HttpClientInterface $httpClient;

    /**
     * @param PlaceService $placeService
     * @param string $googlePlacesApiKey
     * @param HttpClientInterface $httpClient
     */
    public function __construct(private readonly PlaceService $placeService, string $googlePlacesApiKey, HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
        $this->googlePlacesApiKey = $googlePlacesApiKey;
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/admin/place/get-place-details', name: 'app_admin_place_details', methods: ['GET'])]
    public function getPlaceDetails(Request $request): Response
    {
        $placeId = $request->query->get('placeId');
    
        if (!$placeId) {
            return $this->json(['error' => 'Place ID is required.'], Response::HTTP_BAD_REQUEST);
        }
        $url = "https://places.googleapis.com/v1/places/{$placeId}";
    
        $fields = ['*'];
    
        try {
            $response = $this->httpClient->request('GET', $url, [
                'query' => [
                    'fields' => implode(',', $fields),
                    'key' => $this->googlePlacesApiKey,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Google Places API request failed.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        $statusCode = $response->getStatusCode();
        if ($statusCode !== 200) {
            return $this->json(['error' => 'Failed to fetch place details.'], $statusCode);
        }
    
        $content = $response->toArray();
    
        if (!isset($content['name'])) {
            return $this->json(['error' => 'Google Places API error: ' . ($content['status'] ?? 'UNKNOWN')], Response::HTTP_BAD_REQUEST);
        }
    
        $place = $content;
        return $this->json($place);
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

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/place/add', name: 'app_admin_place_add', methods: ['GET'])]
    public function add(Request $request): Response
    {
        return $this->render(
            'admin/pages/place/add.html.twig',
            [
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