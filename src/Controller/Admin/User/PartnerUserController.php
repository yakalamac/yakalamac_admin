<?php
/**
 * @author Onur KUDRET
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Controller\Abstract\AbstractUserController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/admin/users/partner')]
#[IsGranted('ADMIN_USER_VIEWER')]
class PartnerUserController extends AbstractUserController
{
    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/', name: 'app_partner_users')]
    public function index(Request $request): Response
    {
        return $this->render(
            'admin/pages/user/index.html.twig',
            [
                'user_type_description' => 'Partner',
                'base_path' => $this->basePath(),
            ]
        );
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function addUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/edit/{id}', name: 'app_partner_users_edit')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function editUser(Request $request): Response
    {
        return new Response();
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/delete/{id}', name: 'app_partner_users_edit')]
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
    #[Route('/detail/{id}', name: 'app_partner_users_edit')]
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

        return $this->redirectToRoute('app_partner_users', [
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
    #[Route('/list', name: 'app_partner_users_data')]
    #[IsGranted(
        attribute: 'ADMIN_USER_VIEWER',
        message: 'Buraya erişiminiz yoktur.',
        statusCode: Response::HTTP_FORBIDDEN,
        exceptionCode: Response::HTTP_FORBIDDEN
    )]
    public function getUsers(Request $request): Response
    {
        $credentials = $this->getCredentials($request);

        if($credentials === false) {
            return new Response(null,403);
        }

        return $this->service->getUsers('/api/registration/business', $credentials['accessToken']);
    }

    /**
     * @return string
     */
    public function basePath(): string
    {
        return '/admin/users/partner';
    }

    /**
     * @return string
     */
    public function applicationName(): string
    {
        return 'business';
    }
}
/*

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
 */