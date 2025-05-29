<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Service\Google;

use App\Client\GoogleApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class GoogleServiceController extends AbstractController
{
    /**
     * @param GoogleApiClient $client
     */
    public function __construct(private readonly GoogleApiClient $client) {}

    /**
     * @param Request $request
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/_google/place/details/{id}', name: 'google_place_detail')]
    public function placeDetails(Request $request, string $id): Response
    {
        $response = $this->client->setReferer($request->getUri())
            ->placeDetails($id, [
                'headers' => [
                    'X-Goog-FieldMask' => '*'
                ]
            ]);

        return $this->client->toResponse($response);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/_google/service:searchPlace', name: 'google', methods: ['GET', 'POST'])]
    public function searchPlace(Request $request): Response
    {
        $content = $this->getContent($request);

        $response = $this->client->setReferer($request->getUri())
            ->searchPlaceByQuery($content);

        return $this->client->toResponse($response);
    }


    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    #[Route('/_google/service:mybusiness:searchPlace', name: 'google_mybusiness', methods: ['GET', 'POST'])]
    public function searchPlaceByGoogleBusiness(Request $request): Response
    {
        $token = $this->getToken();

        if ($token === NULL) {
            return new JsonResponse(['message' => 'Unexpected error occurred'], 500);
        }

        $content = $this->getContent($request);

        if (isset($content['textQuery'])) {
            $content['query'] = $content['textQuery'];
            unset($content['textQuery']);
        }

        $response = $this->client->setReferer($request->getUri())
            ->searchPlaceByGoogleServiceAccount($token, $content);

        return $this->client->toResponse($response);
    }

    /**
     * @return string|null
     * @throws Throwable
     */
    private function getToken(): ?string
    {
        $result = $this->client->reauth();

        return is_string($result) ? $result : NULL;
    }

    /**
     * @param Request $request
     * @return array
     */
    private function getContent(Request $request): array
    {
        if ($request->isMethod(Request::METHOD_POST)) {
            $contentType = $request->headers->get('content-type');

            return match (true) {
                str_contains($contentType, 'json') => $request->toArray(),
                str_contains($contentType, 'form') => $request->request->all(),
                default => throw $this->createNotFoundException('Invalid content type provided, valid content type was not found.')
            };
        } else {
            return $request->query->all();
        }
    }
}