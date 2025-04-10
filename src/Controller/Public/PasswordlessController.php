<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public;

use App\Client\YakalaApiClient;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

#[Route('/_passwordless', methods: ['POST'])]
class PasswordlessController extends AbstractController
{
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    public function __invoke(Request $request): Response
    {
        $body = $request->toArray();

        if(empty($body['loginId'])) {
            throw new Exception('Geçersiz kimlik bilgisi');
        }

        $body['application'] = str_contains('@yakalamac.com.tr', $body['loginId']) ? 'admin' : 'business';

        $result = $this->client->post('action/login',['json' => $body]);

        return $this->client->toResponse($result);
    }
}