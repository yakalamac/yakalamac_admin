<?php

namespace App\Controller\Admin;

use App\Security\User\ApiUser;
use App\Service\PlaceService;
use App\Repository\AuditLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;
use App\Controller\API\ApiController;
use App\Http\ClientFactory;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use App\Entity\Changelog;
use App\Form\ChangelogType;
use App\Repository\ChangelogRepository;
use Doctrine\ORM\EntityManagerInterface;

class AdminController extends AbstractController
{


    private HttpClientInterface $httpClient;
    private PlaceService $service;
    private UserService $userService;
    private ApiController $apiController;
    private ClientFactory $clientFactory;
    private AuditLogRepository $auditLogRepository;
    private string $elasticUrl;
    private ChangelogRepository $changelogRepository;

    /**
     *
     * @param HttpClientInterface $httpClient
     * @param UserService $userService
     * @param ApiController $apiController
     * @param PlaceService $service
     * @param ClientFactory $clientFactory
     * @param ChangelogRepository $changelogRepository
     * @param AuditLogRepository $auditLogRepository
     * @param string $elasticUrl
     */
    public function __construct(HttpClientInterface $httpClient, UserService $userService, ApiController $apiController, PlaceService $service, ClientFactory $clientFactory, ChangelogRepository $changelogRepository, AuditLogRepository $auditLogRepository, string $elasticUrl)
    {
        $this->httpClient = $httpClient;
        $this->userService = $userService;
        $this->service = $service;
        $this->apiController = $apiController;
        $this->clientFactory = $clientFactory;
        $this->auditLogRepository = $auditLogRepository;
        $this->elasticUrl = $elasticUrl;
        $this->changelogRepository = $changelogRepository;
    }

    #[Route('/login', name: 'login_page')]
    public function login(Request $request): Response
    {
        return $this->render('public/login.html.twig');
    }

    /**
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     */
    #[Route('/admin', name: 'admin_dashboard')]
    public function index(Request $request): Response
    {
        try {
            $query = [
                'track_total_hits' => true,
                'size' => 0,
                'query' => [
                    'match_all' => new \stdClass()
                ]
            ];

            $response = $this->clientFactory->request($this->elasticUrl . "place" . '/_search', 'GET', $query);
            $responseData = $response->toArray(false);
            $totalBusinesses = $responseData['hits']['total']['value'] ?? 0;

            $responseProduct = $this->clientFactory->request($this->elasticUrl . "product" . '/_search', 'GET', $query);
            $responseDataProduct = $responseProduct->toArray(false);
            $totalProduct = $responseDataProduct['hits']['total']['value'] ?? 0;
        } catch (\Exception $e) {
            $totalBusinesses = 0;
            $totalProduct = 0;
        }

        $actions = ['PATCH', 'DELETE', 'POST'];
        $entityTypePrefix = 'api/places/';
        $entityTypePrefixP = 'api/products/';

        $todayOperations = $this->auditLogRepository->countTodayOperations($actions, $entityTypePrefix);
        $todayOperationsProducts = $this->auditLogRepository->countTodayOperations($actions, $entityTypePrefixP);
        $seenChangelogIds = $request->cookies->get('seen_changelogs', '');
        $seenChangelogIds = $seenChangelogIds ? explode(',', $seenChangelogIds) : [];

        $unseenChangelogs = $this->changelogRepository->findUnseenChangelogs($seenChangelogIds);
        return $this->render('admin/pages/dashboard.html.twig', [
            'totalProduct' => $totalProduct,
            'totalBusinesses' => $totalBusinesses,
            'todayOperations' => $todayOperations,
            'todayOperationsProducts' => $todayOperationsProducts,
            'unseenChangelogs' => $unseenChangelogs,
        ]);
    }

    #[Route('/admin/changelogs', name: 'admin_changelog_index')]
    public function changelogs(Request $request, EntityManagerInterface $em, ChangelogRepository $changelogRepository): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $changelog = new Changelog();
        $form = $this->createForm(ChangelogType::class, $changelog);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $changelog->setCreatedAt(new \DateTime());

            $em->persist($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla eklendi.');

            return $this->redirectToRoute('admin_changelog_index');
        }

        $changelogs = $changelogRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->render('admin/pages/system/change-logs.html.twig', [
            'form' => $form->createView(),
            'changelogs' => $changelogs,
        ]);
    }
    #[Route('/admin/changelogs/{id}/delete', name: 'admin_changelog_delete', methods: ['POST'])]
    public function deleteChangelog(Request $request, Changelog $changelog, EntityManagerInterface $em): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($this->isCsrfTokenValid('delete-changelog' . $changelog->getId(), $request->request->get('_token'))) {
            $em->remove($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla silindi.');
        } else {
            $this->addFlash('error', 'Güncelleme notu silinirken bir hata oluştu.');
        }

        return $this->redirectToRoute('admin_changelog_index');
    }


    #[Route('/admin/profile', name: 'app_admin_profile', methods: ['GET'])]
    public function profile(Request $request): Response
    {

        $user = $this->getUser();
        $requestUserIdentifier = $request->getUser();
        if ($requestUserIdentifier !== null && $requestUserIdentifier !== $user->getUserIdentifier()) {
            $reqUser = $request->getUser() ?? 'No User Request';
            throw new \Exception('Kullanıcı bilgisi uyuşmadı ' . $reqUser . ' &  ' . $user->getUserIdentifier());
        }

        if ($user instanceof ApiUser) {

            return $this->render(
                'admin/pages/user/profile.html.twig',
                [
                    'user' => $user->getData(),
                    'linkedAccounts' => $user->getLinkedAccounts(),
                ]
            );
        }

        throw new \Exception('Geçersiz kullanıcı kimliği');
    }

    #[Route('/admin/deleteLinkedAccount', name: 'delete_linked_account')]
    public function deleteLinkedAccounts(Request $request): Response
    {
        $user = $this->getUser();
        $requestUserIdentifier = $request->getUser();
        if ($requestUserIdentifier !== null && $requestUserIdentifier !== $user->getUserIdentifier()) {
            $reqUser = $request->getUser() ?? 'No User Request';
            throw new \Exception('Kullanıcı bilgisi uyuşmadı ' . $reqUser . ' &  ' . $user->getUserIdentifier());
        }
        $type = $request->query->get('type');
        $identityProviderUserId = $request->query->get('identityProviderUserId');

        if ($user instanceof ApiUser) {
            try {
                $response = $this->httpClient->request(
                    'DELETE',
                    $_ENV['API_URL'] . '/api/identity-provider/' . $user->getUserIdentifier(),
                    [
                        'query' => [
                            'type' => $type,
                            'identityProviderUserId' => $identityProviderUserId
                        ]
                    ]
                );
                return new Response('Bağlantı başarıyla silindi.', Response::HTTP_OK);
            } catch (\Exception $e) {
                return  new Response('Bağlantı başarıyla silinmedi.', Response::HTTP_BAD_REQUEST);
            }
        }

        throw new \Exception('Geçersiz kullanıcı kimliği');
    }

    #[Route('/admin/profile', name: 'app_admin_profile_update', methods: ['PATCH'])]
    public function updateProfile(Request $request): Response
    {
        $user = $this->getUser();

        if(!$user instanceof ApiUser) {
           return new JsonResponse('Unauthorized.', Response::HTTP_UNAUTHORIZED);
        }

        $response = $this->userService->update($user, $request->toArray());

        $status = $response->getStatusCode();

        return new JsonResponse(
            $status > 199 && $status < 300 ? $response->toArray(false) : $response->getContent(false),
            $status
        );
    }

    #[Route('/admin/validate', name: 'app_admin_profile_validate', methods: ['POST'])]
    public function profileValidate(Request $request): Response
    {
        $user = $this->getUser();

        if(!$user instanceof ApiUser) {
            return new JsonResponse('Unauthorized.', Response::HTTP_UNAUTHORIZED);
        }
        $contentType = $request->headers->get('content-type');

        $content = match (true) {
            str_contains($contentType, 'json') => $request->toArray(),
            str_contains($contentType, 'form') => $request->request->all(),
            default => null,
        };

        if($content === null) {
            return new JsonResponse('Invalid content type.', Response::HTTP_BAD_REQUEST);
        }

        if(isset($content['state']) && $content['state'] === 'verification') {
            return $this->verificateOTP($content, $user);
        }

        if(! (isset($content['type']) && isset($content['value']))) {
            return new JsonResponse('Invalid request body.' . json_encode($content), Response::HTTP_BAD_REQUEST);
        }

        if(!in_array($content['type'], ['email', 'mobilePhone'])) {
            return new JsonResponse('Invalid validation type.', Response::HTTP_BAD_REQUEST);
        }

        $result = $this->userService->verifyUserCredential($content['type'], $content['value'],  $user);

        $status = $result->getStatusCode();

        if($status > 199 && $status < 300) {
            return new JsonResponse($result->toArray(false), Response::HTTP_OK);
        }

        return new JsonResponse('An error occured.', Response::HTTP_BAD_REQUEST);
    }

    /**
     * @param array $content
     * @param ApiUser $user
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function verificateOTP(array $content, ApiUser $user): Response
    {
        if(isset($content['type']) && $content['type'] === 'mobilePhone' &&
            isset($content['mobilePhone']) && isset($content['verificationToken'])
        ) {
            $response = $this->userService->completeMobilePhoneVerification($content['smsCode'], $content['verificationToken'], $content['mobilePhone'], $user);
            $status = $response->getStatusCode();
            if($status > 199 && $status < 300) {
                return new JsonResponse($response->toArray(false), Response::HTTP_OK);
            } else {
                return new JsonResponse($response->getContent(false), Response::HTTP_OK);
            }
        }

        return new Response('Bad request.', Response::HTTP_BAD_REQUEST);
    }

}
