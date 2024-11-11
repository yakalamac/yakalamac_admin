<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\API;

use App\Http\ClientFactory;
use App\Http\Defaults;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Mime\Part\TextPart;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\VarDumper\Cloner\Data;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ApiController extends AbstractController
{
    private ClientFactory $clientFactory;

    public function __construct()
    {
        $this->clientFactory = new ClientFactory();
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route(
        '/_route/api/{route}',
        name: '_api_get',
        requirements: [
            'route' => '.*'
        ],
        methods: [
            'GET', 'POST', 'PATCH', 'DELETE', 'PUT'
        ]
    )]
    public function onAPIRequest(Request $request, string $route): Response
    {
        return match ($request->getMethod())
        {
            'GET' => $this->onGet($request, $route),
            'POST' => $this->onPost($request, $route),
            'PATCH' => $this->onPatch($request, $route),
            'DELETE' => $this->onDelete($request, $route),
            'PUT' => $this->onPut($request, $route),
            default => $this->onInvalidRequestMethod()
        };
    }

    /**
     * @param Request $request
     * @param string $route
     * @return JsonResponse
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */

    private function onGet(Request $request, string $route): JsonResponse
    {
            return new JsonResponse(
                Defaults::forAPI(
                    $this->clientFactory
                )
                    ->request($route)
                    ->toArray(false)
            );
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/_api/{route}', name: '_api_post', requirements: ['route' => '.*'], methods: ['POST'])]
    public function onPost(Request $request, string $route): Response
    {
        if(Defaults::isMultipart($request))
        {
            return $this->onMultipart($request, $route);
        }
        $data = json_decode($request->getContent(), true);
        
        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
        
        return new JsonResponse(
            Defaults::forAPI($this->clientFactory)
                ->request($route, 'POST', $data, $contentType)
                ->toArray(false)
        );
    }


    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function onPut(Request $request, string $route): Response
    {
        return new JsonResponse(
            Defaults::forAPI(
                $this->clientFactory
            )
                ->request($route, 'PUT')
                ->toArray(false)
        );
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function onDelete(Request $request, string $route): Response
    {
        $response = Defaults::forAPI($this->clientFactory)
                    ->request($route, 'DELETE');
        
        if ($response->getStatusCode() === 204) {
            return new JsonResponse(['message' => 'Resource successfully deleted'], 200);
        }
        return new JsonResponse($response->toArray(false));
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function onPatch(Request $request, string $route): Response
    {
        $data = json_decode($request->getContent(), true);
    
        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
    
        return new JsonResponse(
            Defaults::forAPI($this->clientFactory)
                ->request($route, 'PATCH', $data, $contentType)
                ->toArray(false)
        );
    }
    

    /**
     * @return Response
     */
    private function onInvalidRequestMethod(): Response
    {
        return new JsonResponse(
            [
                'message' => 'Invalid request method provided',
                'status' => 400
            ],
            400
        );
    }

    #[Route('/api/places', name: 'fetch_places')]
    public function fetchPlaces(Request $request): JsonResponse {
        $page = $request->query->get('page', 1);
        
        $places = Defaults::forAPI($this->clientFactory)
            ->request('api/places?page='.$page)
            ->toArray(false);

        return new JsonResponse([
            'hydra:member' => $places,
            'totalCount' => 4000
        ]);
    }


    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function onMultipart(Request $request, string $route): Response
    {
        // 1. JSON verisini alıyoruz
        $data = json_decode($request->request->get('data'), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON data'], 400); // JSON hatası durumunda
        }

        // 2. Dosya yüklemelerini işliyoruz
        $files = [];
        foreach ($request->files as $file) {
            if ($file instanceof UploadedFile) {
                $files[] = DataPart::fromPath($file->getPathname(), $file->getClientOriginalName(), $file->getMimeType());
            }
        }

        // 3. JSON verisini TextPart olarak hazırlıyoruz
        $jsonPart = new TextPart(json_encode($data)); // JSON verisini 'data' olarak ekliyoruz

        // 4. FormDataPart oluşturuyoruz ve JSON verisini ve dosyaları ekliyoruz
        $form = new FormDataPart(array_merge(
            ['data' => $jsonPart], // JSON verisini formda 'data' olarak ekliyoruz
            $files               // Dosyaları ekliyoruz
        ));

        // 5. HTTP istemcisini hazırlıyoruz
        $clientFactory = Defaults::forAPIFile($this->clientFactory);

        // 6. FormData içeriğini ve başlıkları ayarlıyoruz
        $clientFactory->options()->setBody($form->bodyToString());
        $this->clientFactory->options()
            ->setHeader('Content-Type', $form->getMediaType()) // multipart/form-data başlığı
            ->setHeaders($form->getPreparedHeaders()->toArray()); // Gerekli başlıkları alıyoruz

        // 7. API'ye POST isteği gönderiyoruz
        try {
            $response = $clientFactory->requestMultipart($route, 'POST');
        } catch (\Exception $e) {
            // Hata durumunda, hata mesajını döndürüyoruz
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }

        // 8. API yanıtını döndürüyoruz
        return new JsonResponse($response->toArray(false), 200);
    }
}