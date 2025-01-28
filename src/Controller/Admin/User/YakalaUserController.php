<?php
/**
 * @author Onur KUDRET
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use Exception;
use App\Controller\Abstract\AbstractUserController;
use App\Util\DataTableQueryParser;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/admin/users/yakala')]
#[IsGranted('ADMIN_USER_VIEWER')]
class YakalaUserController extends AbstractUserController
{
    /**
     * @param Request $request
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    #[Route('/', name: 'app_yakala_users')]
    public function index(Request $request): Response
    {
        return $this->render(
            'admin/pages/user/index.html.twig',
            [
                'users' => $this->service->getUsers('/users', 'token'),
                'user_type_description' => 'Yakala',
                'base_path' => $this->basePath()
            ]
        );
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
    #[Route('/detail/{id}', name: 'app_yakala_users_detail')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function detailUser(Request $request, string|int $id): Response
    {
        $credentials = $this->getCredentials($request);

        if($credentials === false) {
            return new Response(null,403);
        }

        $response = $this->service->getUser("/api/users",$id, $credentials['accessToken']);

        if($response['ok']) {

            return $this->render('admin/pages/user/detail.html.twig',
                [
                    'user' => $response['data']
                ]
            );
        }

        return $this->redirectToRoute('app_yakala_users', [
            'status_code' => Response::HTTP_FORBIDDEN,
            'message' => $response['data']['message']
        ]);
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/add', name: 'app_yakala_users_add')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function addUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/edit/{id}', name: 'app_yakala_users_edit')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function editUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/delete/{id}', name: 'app_yakala_users_delete')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function deleteUser(Request $request): Response
    {
        return new Response();
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
    #[Route('/list', name: 'app_yakala_users_data')]
    public function getUsers(Request $request): Response
    {
        $credentials = $this->getCredentials($request);

        if($credentials === false) {
            return new Response(null,403);
        }

        $queryParser = new DataTableQueryParser($request);

        return $this->service->getUsers(
            '/api/registration/yakala',
            $credentials['accessToken'],
            $queryParser->start() ?? 1,
            ['draw' => $queryParser->draw()]
        );

//        DataTableResponse::build(
//            $queryParser->draw(),
//            $response['hydra:totalItems'],
//            13,
//            $response['hydra:member'],
//            null
//        );

//        return new JsonResponse(DataTableResponse::build(
//            $queryParser->draw(), 0, 0, [], json_encode($response['response']))
//        );


        //$draw = $request->query->get('draw', 1);
        //$start = intval($request->query->get('start', 0));
        //$length = intval($request->query->get('length', 15));

        //$page = floor($start / $length) + 1;

        //return $this->service->getUsers('/api/user/yakala', 'token');
    }

    /**
     * @return string
     */
    public function basePath(): string
    {
        return '/admin/users/yakala';
    }

    /**
     * @return string
     */
    public function applicationName(): string
    {
        return "yakala";
    }
}
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

            $data = [];

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