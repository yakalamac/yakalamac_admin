<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public;

use App\Client\YakalaApiClient;
use App\Security\Http\Abstract\Authenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LandingPageController extends AbstractController
{
    public function __construct(private YakalaApiClient $yakalaApiClient)
    {

    }

    #[Route('/', name: 'home')]
    public function index(): Response
    {
        return $this->render('public/landing-page/index.html.twig');
    }
    
    #[Route('/appointment', name: 'appointment', methods: ['POST'])]
    public function appointment(Request $request): Response
    {
        if($request -> getContentTypeFormat() != 'json') {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Invalid request format.',
            ], Response::HTTP_BAD_REQUEST);
        }
        $data = json_decode($request->getContent(), true);
        $response = $this -> yakalaApiClient->post(' appointments', [
            'headers' => [
                'content-type' => 'application/json'
            ],
            'json' => $data
        ]);
        
        return $this->yakalaApiClient->toResponse($response);;
    }
}