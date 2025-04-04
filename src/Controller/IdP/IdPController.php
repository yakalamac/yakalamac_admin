<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\IdentityProvider;

use App\DTO\AccountLinkDTO;
use App\DTO\ApiUser;
use App\Interface\IdentityProviderServiceInterface;
use App\Service\IdP\Apple\AppleService;
use App\Service\IdP\Google\GoogleService;
use App\Service\User\UserService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;


class IdentityProviderController extends AbstractController
{
    private readonly ?AppleService $appleService;
    private readonly ?GoogleService $googleService;
    private readonly ?UserService $userService;
    private array $stack = [];

    public function __construct(
        ParameterBagInterface $parameterBag,
        RequestStack          $requestStack,
        HttpClientInterface   $httpClient
    )
    {
        $this->appleService = new AppleService($parameterBag, $httpClient);
        $this->googleService = new GoogleService($httpClient);
        $this->userService = new UserService($requestStack, $httpClient);
    }

    /**
     * @param Request $request
     * @param Security $security
     * @return Response
     * @throws Exception
     */
    #[Route('/oauth2/callback', name: 'oauth2_callback', methods: ['GET', 'POST'])]
    public function callback(Request $request, Security $security): Response
    {
        $user = $security->getUser();

        if (!$user instanceof ApiUser) throw $this->createAccessDeniedException();

        try {
            $content = $this->checkRequestAndGetContent($request);

            $service = $this->googleService;

            if (isset($content['type']) && $content['type'] === 'apple') {
                $service = $this->appleService;
            }

            $result = $this->exchangeToken($content, $service);

            $result = $this->getUserCredentials($result, $user, $service);
            throw new Exception(json_encode($this->stack));
            return $this->linkAccount($result);
        } catch (Throwable $exception) {
            return new JsonResponse($this->standardResponse($exception), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/oauth2/start', name: 'oauth2_start', methods: ['GET'])]
    public function start(Request $request): RedirectResponse|Response
    {
        $csrfToken = $request->get('_csrf_token');
        $redirectUri = $request->query->get('redirectUri');

        if ($redirectUri === null || $csrfToken === null) {
            return new Response('Invalid request', Response::HTTP_BAD_REQUEST);
        }

        $type = $request->query->get('type');

        return match ($type) {
            'google' => $this->googleService->start($redirectUri, $csrfToken),
            'apple', 'applev2', 'applev3' => $this->appleService->start($redirectUri, $csrfToken),
            default => new Response('Invalid request', Response::HTTP_BAD_REQUEST)
        };
    }

    /**
     * @param array $data
     * @param IdentityProviderServiceInterface $service
     * @return array
     * @throws Exception
     */
    private function exchangeToken(array $data, IdentityProviderServiceInterface $service): array
    {
        $result = $this->standardResponse($service->exchange($data));

        if (false === $result['ok']) throw new Exception('Error on credential change.');
        $this->stack['excToken'] = $result['response'];
        return $result['response'];
    }

    /**
     * @param AccountLinkDTO $accountLinkDTO
     * @return JsonResponse
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    private function linkAccount(AccountLinkDTO $accountLinkDTO): JsonResponse
    {
        $result = $this->standardResponse($this->userService->linkAccount($accountLinkDTO));

        if (false === $result['ok']) throw new Exception('Error on linking account.');

        return new JsonResponse($result['response'], Response::HTTP_OK);
    }

    /**
     * @param array $data
     * @param ApiUser $user
     * @param IdentityProviderServiceInterface $service
     * @return AccountLinkDTO
     * @throws Exception
     */
    private function getUserCredentials(array $data, ApiUser $user, IdentityProviderServiceInterface $service): AccountLinkDTO
    {
        $userinfo = $this->standardResponse($service->getUserCredentials($data));

        if (false === $userinfo['ok']) throw new Exception('Error on retrieving credentials.');

        if (!$userinfo['response'] instanceof AccountLinkDTO) throw new Exception('Error on extracting account credentials.');
        $this->stack['userCred'] = $userinfo['response']->__toArray();
        return $userinfo['response']->setUser($user);
    }

    /**
     * @param array|object $returned
     * @return array
     */
    private function standardResponse(array|object $returned): array
    {
        try {

            if (is_array($returned)) {
                return $this->standardArrayResponse(null, null, $returned, null, null, true);
            }

            if ($returned instanceof Throwable) {
                return $this->standardArrayResponse(
                    $returned->getMessage(),
                    $returned->getCode(),
                    null, Response::HTTP_INTERNAL_SERVER_ERROR, null, false
                );
            }

            if ($returned instanceof ResponseInterface) {
                $status = $returned->getStatusCode();
                $headers = $returned->getHeaders(false);
                if (
                    isset($headers['content-type']) &&
                    array_filter(
                        $headers['content-type'],
                        fn($header) => is_string($header) && str_contains('json', $header)
                    ) === []
                ) {
                    $data = $returned->toArray(false);
                } else {
                    $data = $returned->getContent(false);
                }
                return $this->standardArrayResponse(
                    null, null, $data,
                    $status, $headers, $status < 300 && $status > 199
                );
            }

            if (is_object($returned)) {
                return $this->standardArrayResponse(null, null, $returned, null, null, true);
            }

        } catch (Throwable $exception) {
            return $this->standardResponse($exception);
        }

        return $this->standardArrayResponse('Invalid type provided', 500, null, 500, null, false);
    }

    /**
     * @param string|null $exceptionMessage
     * @param string|null $exceptionCode
     * @param mixed $response
     * @param int|null $status
     * @param mixed $headers
     * @param bool|null $ok
     * @return array
     */
    private function standardArrayResponse(
        ?string $exceptionMessage, ?string $exceptionCode, mixed $response,
        ?int    $status, mixed $headers, ?bool $ok): array
    {
        return [
            'exception' => $exceptionMessage,
            'exception-code' => $exceptionCode,
            'response' => $response,
            'status' => $status,
            'headers' => $headers,
            'ok' => $ok
        ];
    }

    /**
     * @param Request $request
     * @return array
     * @throws Exception
     */
    private function checkRequestAndGetContent(Request $request): array
    {
        if ($request->isMethod('POST')) {
            $contentType = $request->headers->get('Content-Type');

            $content = match ($contentType) {
                'application/json' => $request->toArray(),
                'application/x-www-form-urlencoded' => $request->request->all()
            };
        } else {
            $content = $request->query->all();
        }

        if (!isset($content['state'])) {
            throw new Exception('Error on validation. Missing credentials.');
        }

        if (!$this->isCsrfTokenValid('state_csrf_protection', $content['state'])) {
            throw new Exception('Error on validation. Invalid csrf token.');
        }

        return $content;
    }
}