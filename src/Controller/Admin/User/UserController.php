<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use  Symfony\Component\Security\Http\Attribute\IsGranted;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends BaseController
{
    #[Route('/admin/users', name: 'app_users')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/user/user.html.twig');
    }

    #[IsGranted('ADMIN_USER_EDITOR')]
    #[Route('/admin/users/addUser', name: 'add_user', methods: ['POST'])]
    public function addUser(Request $request): JsonResponse
    {

        $credentials = $this->getCredentials($request);

        if ($credentials === false) {
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

        } catch (Exception $exception) {
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

        if (!isset($body['password'])) {
            $body['password'] = ucfirst('y' . bin2hex(random_bytes(8)) . '.');
        }

        if (count(array_intersect(['email', 'password', 'mobilePhone'], $body))) {
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

        $response = $this->service->addUser($body, $credentials['accessToken'] ?? null, $credentials['refreshToken'] ?? null, '/api/users');

        return new JsonResponse($response, $response['status_code']);
    }


    #[IsGranted('ADMIN_USER_EDITOR')]
    #[Route('/admin/users/list')]
    public function getUsers(Request $request): Response
    {
        $credentials = $this->getCredentials($request);
        $query = $request->query->all();
        $page = (($query['start'] ?? 0) / ($query['length'] ?? 15)) + 1;
        return $this->service->getUsers($credentials, $page, $query['length']);

    }

    public function basePath(?string $path = null): string
    {
        return '/admin/users' . ($path ? '/' . ltrim($path, '/') : '');
    }
}