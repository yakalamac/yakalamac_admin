<?php
namespace App\Controller\Admin;

use App\Interface\ControllerInterface;
use App\Service\DictionaryProviderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/admin/dictionary')]
class YakalaDictionary extends AbstractController implements ControllerInterface
{   
    public function __construct(protected readonly DictionaryProviderService $service)
    {
    
    }


    #[Route("/",  name: 'app_dictionary')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/product/dictionary.html.twig');
    }
    
    #[Route("/list", name: 'app_dictionaries')]
    public function getAll(Request $request): Response
    {

        $credentials = $this->getCredentials($request);

        if($credentials == false){
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'You have not permission for this operation.',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $query = $request->query->all();
        $page = (($query['start'] ?? 0) / ($query['length'] ?? 15)) + 1;
        return $this->service->getDictionaries($credentials['accessToken'] ?? NULL, $credentials['refreshToken'] ?? NULL, $page, $query['length'] ?? 15);
    }

    #[route('/edit/{id}' , name:'app_edit_dictionary', methods:['PATCH'])]
    public function edit(Request $request, string|int $id): Response
    {
        $credentials = $this->getCredentials($request);

        if ($credentials == null) { 
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'You have not permission for this operation.',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);
        }
    
        $data  = json_decode($request->getContent(), true);    

        if(!$data){
           return  new JsonResponse([
                'status' => 'error',
                'message' => 'Update failed',
                'error_code' => '400',
                'details' => 'Required data is missing or invalid.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $response = $this->service->updateDictionary('/api/dictionaries', $id, $credentials['accessToken'] ?? NULL, $credentials['refreshToken'] ?? NULL, $data);

        if(!$response['status_code']){
            return new JsonResponse([
                "status"=> "error",
                "message"=> "Update failed",
                "error_code" => "400",
                "details"=> "The provided data is invalid or missing required fields."
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Update successfully',
            'data' => $response['data'] 
        ], Response::HTTP_ACCEPTED);
    }

    #[Route('/add', name:'app_add_dictionary', methods:['POST'])]
    public function add(Request $request): Response
    {       
        
        $credentials = $this->getCredentials($request);
        

        if ($credentials == null) { 
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'You have not permission for this operation.',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);

        }
        
        $data  = json_decode($request->getContent(), true);    
        
        if(!$data){
           return  new JsonResponse([
                'status' => 'error',
                'message' => 'Update failed',
                'error_code' => '400',
                'details' => 'Required data is missing or invalid.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $response = $this->service->addDictionary('/api/dictionaries', $credentials['accessToken'] ?? NULL, $credentials['refreshToken'] ?? NULL,  $data);
        $statusCode = $response['status_code'];
        
        if (!$statusCode) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Resource creation failed',
                'error' => $response['data']['message']
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Resource created successfully',
            'data' => $response['data'] 
        ], Response::HTTP_CREATED);
    }
        
    #[Route('/delete/{id}' , name:'app_delete_dictionary' , methods:['DELETE'])]
    public function delete(Request $request, string $id):Response{
        
        $credentials = $this->getCredentials($request);
        
        if ($credentials == null) { 
            return new JsonResponse([
                'status_code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'You have not permission for this operation.',
                'title' => 'Access Denied'
            ], Response::HTTP_UNAUTHORIZED);

        }

        $response = $this->service->deleteDictionary('api/dictionaries', $id, $credentials['accessToken'] ?? NULL, $credentials['refreshToken'] ?? NULL);
        

        if($response)
        {
            //return new Response(json_encode($response));
            if(!$response == Response::HTTP_NO_CONTENT)
            {
                return new JsonResponse([
                    'status' => 'success',
                    'message' => 'Dictionary deleted successfully.'
                ], Response::HTTP_NO_CONTENT);
            }
            
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Delete failed',           
                'error' => $response['data']
            ], Response::HTTP_BAD_REQUEST);
        
        }else {

            return new JsonResponse([
                'status' => 'error',
                'message' => 'Request failed',
                'error' => 'The request could not be processed.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route("/detail/{id}", name:"app_detail_dictionary")]
    public function detail(Request $request , string $id):Response{

        $credentials = $this->getCredentials($request);

        if ($credentials == false) { 
            return $this->redirectToRoute('app_dictionary', ['status_code' => Response::HTTP_FORBIDDEN,'message' => 'Access denied']);
        }

        $response = $this->service->getDictionary('/api/dictionaries', $id, $credentials['accessToken'], $credentials['refreshToken'] ?? NULL);

    if (!$response['status_code']) {
        return $this->redirectToRoute('app_dictionary', [
            'status_code' => Response::HTTP_FORBIDDEN,
            'message' => $response['data']['message']
        ]);  
    }

    return $this->render('admin/pages/product/dictionary_detail.html.twig', ['dictionary' => $response['data']]);

    }

    public function getCredentials(Request $request){
        
        $session = $request->getSession();
        
        $token = $session->get('accessToken');
        $refreshToken = $session->get('refreshToken');

        if($refreshToken === null && $token === null)
        {   
            $response = $this->onAccessDenied();

            if(is_array($response)){

                throw new \Exception(json_encode($response), 403);
            }
        }
        
        
        return [
            'accessToken' => $token,
            'refreshToken' => $refreshToken
        ];
    }

    protected function onAccessDenied(): array|null
    {
        return null;
    }

}