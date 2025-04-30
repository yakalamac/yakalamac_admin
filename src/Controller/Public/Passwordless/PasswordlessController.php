<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public\Passwordless;

use App\Client\YakalaApiClient;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

#[Route('/_passwordless', name: 'app_login_passwordless', methods: ['POST'])]
class PasswordlessController extends AbstractController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     */
    public function __invoke(Request $request): Response
    {
        $body = $this->getBody($request);

        if(empty($body['loginId'])) {
            throw new Exception('Geçerli kimlik bilgisi giriniz.');
        }

        $body['application'] = str_contains('@yakalamac.com.tr', $body['loginId']) ? 'admin' : 'business';

        $result = $this->client->post('action/login',['json' => $body]);

        return $this->client->toResponse($result);
    }

    /**
     * @param Request $request
     * @return array
     * @throws Exception
     */
    private function getBody(Request $request): array
    {
        return match ($request->getContentTypeFormat()) {
            'json' => $request->toArray(),
            'form' => $request->request->all(),
            default => throw new Exception('Invalid content type provided')
        };
    }
}