<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Event;

use App\DTO\ApiUser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\EventDispatcher\Event;

class SessionStartEvent extends Event
{
    /**
     * @param ApiUser $user
     * @param Response $response
     * @param Request $request
     */
    public function __construct(
        private readonly ApiUser $user,
        private readonly Response $response,
        private readonly Request $request
    ) {}

    /**
     * @return Response
     */
    public function getResponse(): Response
    {
        return $this->response;
    }

    /**
     * @return ApiUser
     */
    public function getApiUser(): ApiUser
    {
        return $this->user;
    }

    /**
     * @return Request
     */
    public function getRequest(): Request
    {
        return $this->request;
    }
}