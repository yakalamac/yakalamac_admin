<?php
/**
 * @author Onur KUDRET
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Controller\Abstract\AbstractUserController;
use Exception;
use Random\RandomException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/admin/users/admin')]
#[IsGranted('ADMIN_USER_VIEWER')]
class AdminUserController extends AbstractUserController
{
    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/', name: 'app_admin_users')]
    public function index(Request $request): Response
    {
        return $this->render(
            'admin/pages/user/index.html.twig',
            [
                'user_type_description' => 'Admin',
                'base_path' => $this->basePath()
            ]
        );
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/edit/{id}', name: 'app_admin_users_edit')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function editUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/delete/{id}', name: 'app_admin_users_edit')]
    #[IsGranted('ADMIN_USER_MANAGER')]
    public function deleteUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @param string|int $id
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route('/detail/{id}', name: 'app_admin_users_edit')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function detailUser(Request $request, string|int $id): Response
    {
        $credentials = $this->getCredentials($request);

        if($credentials === false) {
            return new Response(null,403);
        }

        $response = $this->service->getUser("/api/users",$id, $credentials['accessToken']);

        if($response['ok']) {

            return $this->render('admin/pages/user/admin/detail.html.twig',
                [
                    'user' => $response['data']
                ]
            );
        }

        return $this->redirectToRoute('app_admin_users', [
            'status_code' => Response::HTTP_FORBIDDEN,
            'message' => $response['data']['message']
        ]);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    #[Route('/list', name: 'app_admin_users_data')]
    public function getUsers(Request $request): Response
    {
         $credentials = $this->getCredentials($request);

         if($credentials === false) {
             return new Response(null,403);
         }

        return $this->service->getUsers('/api/registration/admin', $credentials['accessToken']);
    }

    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws RandomException
     * @throws Exception
     */
    #[Route('/add', name: 'app_admin_users_add', methods: ['POST'])]
    #[IsGranted('ADMIN_USER_MANAGER')]
    public function addUser(Request $request): Response
    {
        $credentials = $this->getCredentials($request);

        if($credentials === false) {
            return new JsonResponse(
                [
                    'status' => 'error',
                    'ok' => false,
                    'status_code' => Response::HTTP_UNAUTHORIZED,
                    'message' => 'Unauthorized, check your credentials.'
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        try {
            $body = $request->toArray();
        }catch (Exception $exception){
            error_log($exception->getMessage());
            return new JsonResponse(
                [
                    'ok' => false,
                    'status' => 'error',
                    'status_code' => Response::HTTP_BAD_REQUEST,
                    'message' => 'Bad request, no body provided.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        if(!isset($body['password'])) {
            $body['password'] = ucfirst('y'.bin2hex(random_bytes(8)).'.');
        }

        if(count(array_intersect(['email', 'password', 'mobilePhone'], $body))) {
            return new JsonResponse(
                [
                    'ok' => false,
                    'status' => 'failure',
                    'status_code' => 400,
                    'message' => 'Bad request, invalid credentials.',
                    'data' => $body
                ],
                Response::HTTP_BAD_REQUEST);
        }


        $response = $this->service->addUser($body, $credentials['accessToken'], '/api/users');

        if($response['ok']) {
            $adminRegistrationResponse = $this->service->addUser(
                [
                    'username' => $body['email'],
                    'user' => '/api/users/'.$response['data']['user']['id'],
                ],
                $credentials['accessToken'],
                '/api/registration/admin'
            );

            if($adminRegistrationResponse['ok']) {
                $response['data']['user']['adminRegistration'] = $adminRegistrationResponse['data']['user'];

                return new JsonResponse($response, Response::HTTP_CREATED);
            }

            return new JsonResponse(
                [
                    'ok' => false, 'status' => 'failure', 'status_code' => 424,
                    'message' => 'Kullanıcı hesabı oluşturuldu, admin kaydı açılırken bir sorun oluştu.',
                    'data' => [
                        'user'=> $response['data'], 'registrationError' => $adminRegistrationResponse['message']
                    ]
                ],
                Response::HTTP_FAILED_DEPENDENCY
            );
        }

        return new JsonResponse($response, $response['status_code']);
    }

    /**
     * @return string
     */
    public function applicationName(): string
    {
        return "admin";
    }

    /**
     * @return string
     */
    public function basePath(): string
    {
        return '/admin/users/admin';
    }
}

/*
        $draw = $request->query->get('draw', 1);
        $start = intval($request->query->get('start', 0));
        $length = intval($request->query->get('length', 15));

        $page = floor($start / $length) + 1;

        $array = json_decode($response->getContent(), true);

        $total = array_key_exists('hydra:totalItems',$array['data']) ? $array['data']['hydra:totalItems'] : count($array['data']);

        $response->setData([
            'draw' => $draw,
            'recordsTotal' => $total,
            'recordsFiltered' => $total,
            'data' => $array['data']['hydra:member'] ?? [],
            'status' => $array['status'],
            'status_code' => $array['status_code'],
            'message' => $array['message'],
            'real_data' => $array['data'] ?? []
        ]);
 */

/*
public function old(Request $request): Response
{
    $draw = intval($request->query->get('draw', 1));
    $start = intval($request->query->get('start', 0));
    $length = intval($request->query->get('length', 15));

    $page = floor($start / $length) + 1;

    $accessToken = $request->getSession()->get('accessToken');

    if (!$accessToken) {
        return new JsonResponse([
            'error' => 'User not authenticated'
        ], 401);
    }

    $client = HttpClient::create([
        'headers' => [
            'Authorization' => 'Bearer ' . $accessToken
        ]
    ]);

    try {
        $profilesResponse = $client->request('GET', 'http://127.0.0.1:7000/api/user/profiles', [
            'query' => ['page' => $page],
        ]);
        $profilesData = $profilesResponse->toArray();

        $profiles = $profilesData['hydra:member'] ?? [];
        $totalProfiles = $profilesData['hydra:totalItems'] ?? 0;

        $response = [
            'draw' => $draw,
            'recordsTotal' => $totalProfiles,
            'recordsFiltered' => $totalProfiles,
            'data' => $profiles
        ];

        return new JsonResponse($response);

    } catch (Exception $e) {
        return new JsonResponse([
            'error' => 'An error occurred while fetching user data.',
            'details' => $e->getMessage()
        ], 500);
    }
}
 */