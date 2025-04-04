<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Google;

use App\Service\Google\GoogleAPIService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class GoogleServiceController extends AbstractController
{
    public function __construct(private readonly GoogleAPIService $googleAPIService) {}

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_route/service/google:searchPlace', name: 'google', methods: ['GET', 'POST'])]
    public function searchPlace(Request $request): JsonResponse
    {
        $content = $this->getContent($request);

        $response = $this->googleAPIService
                ->setReferer($request->getHttpHost())
                ->searchPlaceByQuery($content);

        $status = $response->getStatusCode();

        if($status < 200 || $status > 299) {
            return new JsonResponse([
                'success' => false,
                'message' => 'An error occured while searching Google place',
                'status' => $status,
                'google-rs'=> $response->toArray(false)
            ], 400);
        }

        return new JsonResponse($response->toArray(false), $status);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_route/service/google:mybusiness:searchPlace', name: 'google_mybusiness', methods: ['GET', 'POST'])]
    public function searchPlaceByGoogleBusiness(Request $request): JsonResponse
    {
        $token = $this->getToken();

        if($token === null) {
            return new JsonResponse(['message' => 'Unexpected error occurred'], 500);
        }

        $content =$this->getContent($request);

        if(isset($content['textQuery'])) {
            $content['query'] = $content['textQuery'];
            unset($content['textQuery']);
        }

        $response = $this->googleAPIService
            ->setReferer($request->getHttpHost())
            ->searchPlaceByGoogleServiceAccount($token, $content);

        $status = $response->getStatusCode();

        if($status < 200 || $status > 299) {
            return new JsonResponse([
                'success' => false,
                'message' => 'An error occured while searching Google place',
                'status' => $status,
                'google-rs'=> $response->toArray(false)
            ], 400);
        }

        return new JsonResponse($response->toArray(false), $status);
    }

    /**
     * @return string|null
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function getToken(): ?string
    {
        $result = $this->googleAPIService->reauth();

        if(!is_string($result)) {
            return null;
        }

        return $result;
    }

    /**
     * @param Request $request
     * @return array
     */
    private function getContent(Request $request): array
    {
        if($request->isMethod(Request::METHOD_POST)) {
            $contentType = $request->headers->get('content-type');
            return match (true) {
                str_contains($contentType, 'json') => $request->toArray(),
                str_contains($contentType, 'form') => $request->request->all()
            };
        } else {
            return $request->query->all();
        }
    }
}