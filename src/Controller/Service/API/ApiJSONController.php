<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Service\API;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use App\DTO\ApiUser;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[Route('/_json/{route}', name: 'api_json', requirements: ['route' => '.+'])]
class ApiJSONController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws Throwable
     */
    public function __invoke(Request $request, string $route): Response
    {
        $options = $this->buildOptions($request);

        $method = strtolower($request->getMethod());

        $result = $this->client->{$method}($route, $options);

        return $this->client->toResponse($result);
    }

    /**
     * @param Request $request
     * @return array
     * @throws Exception
     */
    private function buildOptions(Request $request): array
    {
        $user = $this->getUser();

        if(!$user instanceof ApiUser) {
            throw $this->createAccessDeniedException();
        }

        $options = ['query' => $request->query->all(), 'auth_bearer' => $user->getAccessToken()];

        if($request->isMethod('DELETE')) {
            return $options;
        }

        $options['headers']['accept'] = $request->headers->get('accept', 'application/ld+json');

        if($request->isMethod('GET')) {
            return $options;
        }

        $options['headers']['Content-Type'] = $request->headers->get('Content-Type', 'application/json');

        if(!str_contains($options['headers']['Content-Type'], 'json')) {
            throw new Exception('Invalid content type provided');
        }

        $options['json'] = $request->toArray();

        return $options;
    }
}