<?php
/**
 * @author Onur KUDRET
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Interface\UserControllerInterface;
use App\Service\UserProviderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class AdminUserController extends AbstractController implements UserControllerInterface
{

    public function __construct(private readonly UserProviderService $service)
    {
    }

    public function applicationName(): string
    {
        return "admin";
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/users/list', name: 'app_admin_users')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/user/index.html.twig');
    }

    public function edit(Request $request): Response
    {
        // TODO: Implement edit() method.
    }

    #[Route('/admin/users/data', name: 'app_admin_users_data')]
    public function getUsers(Request $request): Response
    {
        $draw = $request->query->get('draw', 1);
        $start = intval($request->query->get('start', 0));
        $length = intval($request->query->get('length', 15));

        $page = floor($start / $length) + 1;

        $response = $this->service->getUsers('admin', 'token');

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

        return $response;
    }

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

            $data = [];

            $response = [
                'draw' => $draw,
                'recordsTotal' => $totalProfiles,
                'recordsFiltered' => $totalProfiles,
                'data' => $profiles
            ];

            return new JsonResponse($response);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'An error occurred while fetching user data.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/admin/users/add', name: 'app_admin_users_add', methods: ['POST'])]
    public function addUser(Request $request): Response
    {
        try {
            $body = $request->toArray();
        }catch (\Exception $e){
            return new JsonResponse([
                'status' => 'error',
                'status_code' => 400,
                'message' => 'Bad request, no body provided.',
                'data' => null
            ]);
        }


        if(array_key_exists('email',$body))
        {
            $password =  ucfirst('y'.bin2hex(random_bytes(8)).'.');

            $response = $this->service->addUser(
                [
                    'email' => $body['email'],
                    'password' => $password,
                ],
                'token'
            );

            if($response->getStatusCode() === 201)
            {
                $data = json_decode($response->getContent(),true);

                $user = $data['data']['user'];
                $accessToken = $data['data']['accessToken'];
                $adminResponse = $this->service->addUser([],$accessToken, '/api/user/'.$user['id'].'/register/admin');
                if($adminResponse->getStatusCode() > 199 && $adminResponse->getStatusCode() < 300)
                {
                    $adminData = json_decode(
                        $adminResponse->getContent(),
                        true
                    );

                    $adminRegistration = $adminData['data'];
                    $user['adminRegistration'] = $adminRegistration;

                    return new JsonResponse(
                        [
                            'status' => 'success',
                            'status_code' => 201,
                            'message' => 'User created successfully.',
                            'data' => $user,
                            'real_data' => array_merge($data,$adminData),
                            'generatedPassword' => $password
                        ],
                        201
                    );
                }
                // Rollback şart bu kısımda
                return new JsonResponse(
                    [
                        'status' => 'error',
                        'status_code' => $adminResponse->getStatusCode(),
                        'message' => 'An error occurred while creating admin user.',
                        'data' => null,
                        'real_data' => $data,
                        'generatedPassword' => $password
                    ],
                $adminResponse->getStatusCode() > 99 ? $adminResponse->getStatusCode() : 500);
            }
        }

        return new JsonResponse([
            'status' => 'error',
            'status_code' => 400,
            'message' => 'Bad request, no email provided.',
            'data' => null
        ], 400);
    }

    public function editUser(Request $request): Response
    {
        // TODO: Implement editUser() method.
    }

    public function deleteUser(Request $request): Response
    {
        // TODO: Implement deleteUser() method.
    }
}