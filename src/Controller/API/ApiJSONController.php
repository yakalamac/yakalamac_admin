<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\API;

use App\Controller\Abstract\BaseController;
use App\DTO\ApiUser;
use App\Http\Client;
use App\Http\Defaults;
use App\Service\Audit\AuditLogService;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Mime\Part\TextPart;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

class ApiJSONController extends BaseController
{
    private Client $client;
    private AuditLogService $auditLogService;
 
    public function __construct(AuditLogService $auditLogService)
    {
        $this->client = Defaults::forAPI(new Client());
        $this->auditLogService = $auditLogService;
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws Throwable
     */
    #[Route(
        '/_route/api/{route}', name: '_api_mix', requirements: ['route' => '.*'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
    )]
    public function index(Request $request, string $route): Response
    {
        $user = $this->getUser();

        if(!$user instanceof ApiUser) {
            throw new AccessDeniedException('No authenticated user.');
        }

        return match ($request->getMethod()) {
            'GET' => $this->get($request, $route),
            'POST' => $this->post($request, $route),
            'PATCH' => $this->patch($request, $route),
            'DELETE' => $this->delete($request, $route),
            'PUT' => $this->put($request, $route),
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
    private function get(Request $request, string $route): JsonResponse
    {
        $queries = $request->query->all();

        if(count($queries) > 0) {
            $this->client->options()->setQuery($queries);
        }

        return new JsonResponse(
            $this->client->request($route)
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
    #[IsGranted('ADMIN_ENTITY_EDITOR')]
    #[Route('/_api/{route}', name: '_api_post', requirements: ['route' => '.*'], methods: ['POST'])]
    public function post(Request $request, string $route): Response
    {
        if(Defaults::isMultipart($request))
        {
            return $this->onMultipart($request, $route);
        }

        $data = json_decode($request->getContent(), true);

        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
           
        if (str_starts_with($route, 'api/place') && !str_starts_with($route, 'api/places')) {
            $response = Defaults::forAPI($this->clientFactory)
                ->request($route, 'POST', $data, $contentType)
                ->toArray(false);
    
            return new JsonResponse($response);
        }

        /** @var ApiUser $user */
        $user = $this->getUser();
        $userData = $user->getData();
        $userName = sprintf(
            '%s %s',
            $userData['firstName'] ?? 'Bilinmiyor',
            $userData['lastName'] ?? 'Bilinmiyor'
        );
        $response = Defaults::forAPI($this->clientFactory)->request($route, 'POST',$data,$contentType);
        $responseId = $response->toArray(false);
        if ($response->getStatusCode() === 201) {
            $this->auditLogService->log(
                $user->getUserIdentifier(),
                $responseId['id'] ?? null,
                'POST',
                $route,
                [
                    'newData' => $data,
                    'userName' => $userName,
                ]
            );
    
        }
        
        return new JsonResponse($response->toArray(false));
    }

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws TransportExceptionInterface
     */
    public function put(Request $request, string $route): Response
    {
        return new JsonResponse($this->client->request($route, 'PUT', $request->request->all()));
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
    private function delete(Request $request, string $route): Response
    {
        $previousData = $this->fetchEntityData($route);
    
        $response = Defaults::forAPI($this->clientFactory)
            ->request($route, 'DELETE');
    
        /** @var ApiUser $user */
        $user = $this->getUser();
        $userData = $user->getData();
        $userName = sprintf(
            '%s %s',
            $userData['firstName'] ?? 'Bilinmiyor',
            $userData['lastName'] ?? 'Bilinmiyor'
        );
    
        if ($response->getStatusCode() === 204) {
            $this->auditLogService->log(
                $user->getUserIdentifier(),
                $previousData['id'] ?? null,
                'DELETE',
                $route,
                [
                    'oldData' => $previousData,
                    'userName' => $userName,
                ]
            );
    
            return new JsonResponse(['message' => 'Resource successfully deleted'], 200);
        }
    
        return new JsonResponse($response->toArray(false), $response->getStatusCode());
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
    private function patch(Request $request, string $route): Response
    {

        $data = json_decode($request->getContent(), true);
        $contentType = $request->headers->get('Content-Type') ?: 'application/ld+json';
    
        if (str_starts_with($route, 'api/place') && !str_starts_with($route, 'api/places')) {
            $response = $this->clientFactory
                ->request($route, 'PATCH', $data, $contentType)
                ->toArray(false);
    
            return new JsonResponse($response);
        }
    
        $previousData = $this->fetchEntityData($route);
    
        $changes = str_starts_with($route, 'api/places')
            ? ['oldData' => $previousData]
            : $this->calculateChanges($previousData, $data);
    
        $response = Defaults::forAPI($this->clientFactory)
            ->request($route, 'PATCH', $data, $contentType)
            ->toArray(false);
    
        /** @var ApiUser $user */
        $user = $this->getUser();
        $userData = $user->getData();
        $userName = sprintf(
            '%s %s',
            $userData['firstName'] ?? 'Bilinmiyor',
            $userData['lastName'] ?? 'Bilinmiyor'
        );
    
        $this->auditLogService->log(
            $user->getUserIdentifier(),
            $response['id'] ?? null,
            'PATCH',
            $route,
            [
                'changes' => $changes,
                'userName' => $userName,
            ]
        );
    
        return new JsonResponse($response);
    }
    
    

    /**
     * Önceki veriyi kaynaktan alır.
     */
    private function fetchEntityData(string $route): array
    {
        return Defaults::forAPI($this->clientFactory)
            ->request($route, 'GET')
            ->toArray(false);
    }

    /**
     * Değişiklikleri hesaplar.
     */
    private function calculateChanges(array $oldData, array $newData): array
    {
        $changes = [];
        foreach ($newData as $key => $newValue) {
            $oldValue = $oldData[$key] ?? null;
            if ($oldValue !== $newValue) {
                $changes[$key] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }
        return $changes;
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
        // Retrieve user from controller
        $user = $this->getUser();

        // Check user is valid
        if(!$user instanceof ApiUser) {
            return new JsonResponse(['message' => 'User not found', 'status' => 404, 'detail' => 'Unauthorized.'], 404);
        }

        // Convert data to array
        $data = $request->request->all();

        if(!empty($data)) {
            if(isset($data['data'])) {
                // If don't empty, fancy uploader will send data as JSON String in data key
                $data = ['json_context'=>new TextPart($data['data'])];
            } else {
                foreach ($data as $key => $value) {
                    $data[$key] = new TextPart($value);
                }
            }
        }

        // Merge files with data
        $data = array_merge($data, $this->extractFiles($request));

        // Create new form data
        $form = new FormDataPart($data);

        // Create a factory for multipart
        $clientFactory = Defaults::forAPIFile($this->clientFactory);
        
        //Set form data options with authentication token
        $clientFactory->options()->setBody($form->bodyToString());
        $this->clientFactory->options()
            ->setHeader('Content-Type', $form->getMediaType()) // Set Content-Type using form (Not pass manually multipart/form-data)
            ->setAuthBearer($user->getAccessToken()) // Pass auth token
            ->setHeaders($form->getPreparedHeaders()->toArray()); // Re-set headers from form

        // Send request post
        try {
            $response = $clientFactory->requestMultipart($route, 'POST');
        } catch (\Throwable $e) {
            // On error, send error response json
            return new JsonResponse(['error' => $e->getMessage(), 'success' => false, 'errorcode' => 500], 500);
        }

        // On success return response array as JSON
        return new JsonResponse([
            'success' => true,
            'message' => $response->toArray(false)
        ], $response->getStatusCode());
    }

    /**
     * @param Request $request
     * @return array
     */
    private function extractFiles( Request $request): array
    {
        $files = [];
        // Loop through files
        foreach ($request->files->all() as $file) {
            if ($file instanceof UploadedFile) {

                if(str_contains($file->getClientMimeType(), 'video')) {
                    $files['file'] = DataPart::fromPath($file->getPathname(), $file->getClientOriginalName(), $file->getMimeType());
                    return $files;
                }

                $files[$file->getPathname()] = DataPart::fromPath($file->getPathname(), $file->getClientOriginalName(), $file->getMimeType());
            }
        }
        return $files;

    }
}