<?php
/**
 * @author Onur KUDRET
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Interface\UserControllerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PartnerUserController extends AbstractController implements UserControllerInterface
{
    /**
     * @return string
     */
    public function applicationName(): string
    {
        return 'business';
    }

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/partner/users/list', name: 'app_partner_users')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/user/index.html.twig');
    }

    public function edit(Request $request): Response
    {
        // TODO: Implement edit() method.
    }

    #[Route('/partner/users/data', name: 'app_partner_users_data')]
    public function getUsers(Request $request): Response
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

    public function addUser(Request $request): Response
    {
        // TODO: Implement addUser() method.
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