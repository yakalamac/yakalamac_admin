<?php

namespace App\Controller\Admin\User;

use App\Controller\Abstract\AbstractUserController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use  Symfony\Component\Security\Http\Attribute\IsGranted;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractUserController
{
    #[Route('/admin/users', name: 'app_users')]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function index(Request $request):Response
    {
    return $this->render('admin/pages/user/user.html.twig'
    );
    }

    #[IsGranted('ADMIN_USER_EDITOR')]
    #[Route('/admin/users/addUser', name: 'add_user' , methods:['POST'])]
    public function addUser(Request $request): JsonResponse
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
        
        $response = $this->service->addUser($body, $credentials['accessToken'] ?? null , $credentials['refreshToken'] ?? null, '/api/users');

        return new JsonResponse($response, $response['status_code']);
    }

    public function applicationName():string
    {
        return 'User Management';
    }   

    #[IsGranted('ADMIN_USER_EDITOR')]
    #[Route('/admin/users/list')]
    public function getUsers(Request $request): Response{


        $credentials = $this->getCredentials($request);

        if($credentials === false){
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
        
        $query = $request->query->all();
        
        $page = (($query['start'] ?? 0) / ($query['length'] ?? 15)) + 1;
        //throw new Exception('ersdf');
        return  $this->service->getUsers( $credentials['refreshToken'] ?? null , $credentials['accessToken'] ?? null , $page ,$query['length']);

    }

    public function basePath(?string $path = null): string
    {
        return '/admin/users' . ($path ? '/' . ltrim($path, '/') : '');
    }

    #[IsGranted('ADMIN_USER_EDITOR')]
    #[Route('/admin/users/detail/{id}')]
    public function detailUser(Request $request ,string|int $id): Response
    {    
        $credentials = $this->getCredentials($request);

        if($credentials == false ) {
            return $this->redirectToRoute('app_users', ['status_code' => Response::HTTP_FORBIDDEN,'message' => 'Access denied']);
        }
       
        $response = $this->service->getUser("/api/users", $id, $credentials['accessToken'], $credentials['refreshToken']);

        if($response['status'] !== 'success') {
            return $this->redirectToRoute('app_users', [
                'status_code' => Response::HTTP_FORBIDDEN,
                'message' => $response['data']['message']
            ]);
        }

        return $this->render('admin/pages/user/edit.html.twig', [ 'user' => $response['data']]);
    }
    
    
    #[Route('/admin/users/edit/{id}', name: 'admin_user_edit' , methods:['PATCH' , 'POST'])]
    #[IsGranted('ADMIN_USER_EDITOR')]
    public function editUser(Request $request , string $id):Response 
    {
        $credentials = $this->getCredentials($request);

        if (!$credentials) { 
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'You have not permission for this operation.',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);
        }
    
        $data  = json_decode($request->getContent(), true);

        if(!$data || !isset($data['email'])){
        
            return new JsonResponse(['ok' => false , 'mesagge' => 'eksik veri'],Response::HTTP_BAD_REQUEST);
        }
        $updateResponse = $this->service->updateUser('/api/users' , $id , $credentials['accessToken']);

        if (!$updateResponse['ok']) {
            return new JsonResponse([
                'ok' => false,
                'message' => 'Update failed!',
                'error' => $updateResponse['data']['message']
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'ok' => true,
            'message' => 'Update Successfuly',
        ], Response::HTTP_ACCEPTED);
            
    }

    #[Route('/admin/users/delete/{id}', name: 'admin_user_delete', methods:['DELETE'])]
    #[IsGranted('ADMIN_USER_MANAGER')]
    public function deleteUser(Request $request, string $id ):Response{
        
        $credentials = $this->getCredentials($request);
        if($credentials == false)
        {
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' =>   'you have not premission this operation',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $response = $this->service->deleteUser('api/users', $id, $credentials['accessToken'], $credentials['refreshToken']);
        if ($response) {

            if ($response->getStatusCode() === Response::HTTP_NO_CONTENT) {
                return new JsonResponse([
                    'status' => 'success',
                    'message' => 'User deleted successfully.'
                ], Response::HTTP_NO_CONTENT);
            }
        
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Delete failed',
                'error' => $response['data'] 
            ], Response::HTTP_BAD_REQUEST);
        } else {

            return new JsonResponse([
                'status' => 'error',
                'message' => 'Request failed',
                'error' => 'The request could not be processed.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
}

}