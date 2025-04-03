<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\API;

use App\Http\ClientFactory;
use App\Http\Defaults;
use App\Security\User\ApiUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
use App\Service\AuditLogService;


class ApiController extends AbstractController
{
    private ClientFactory $clientFactory;
    private AuditLogService $auditLogService;
 
    public function __construct(AuditLogService $auditLogService)
    {
        $this->clientFactory = new ClientFactory();
        $this->auditLogService = $auditLogService;
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
        requirements: ['route' => '.*'],
        methods: [
            'GET', 'POST', 'PATCH', 'DELETE', 'PUT'
        ]
    )]
    public function onAPIRequest(Request $request, string $route): Response
    {
        $method = $request->getMethod();

        $attribute = match ($method){
            'GET' => 'ADMIN_ENTITY_VIEWER',
            'POST','PUT','PATCH' => 'ADMIN_ENTITY_EDITOR',
            'DELETE' => 'ADMIN_ENTITY_MANAGER'
        };

        $this->clientFactory = Defaults::forAPI($this->clientFactory);
        $user = $this->getUser();
        if($user instanceof ApiUser) {
            $options = $this->clientFactory->options();
            if(null !== $accessToken = $user->getAccessToken()) {
                $options->setAuthBearer($accessToken);
            }

            if(null !== $refreshToken = $user->getRefreshToken()) {
                $options->setHeader('Yakalamac-Refresh-Token', $refreshToken);
            }
        }

        //$this->denyAccessUnlessGranted($attribute, $request);

        return match ($method)
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
            Defaults::forAPI($this->clientFactory)
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
    #[IsGranted('ADMIN_ENTITY_EDITOR')]
    #[Route('/_api/{route}', name: '_api_post', requirements: ['route' => '.*'], methods: ['POST'])]
    public function onPost(Request $request, string $route): Response
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
    private function onPatch(Request $request, string $route): Response
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