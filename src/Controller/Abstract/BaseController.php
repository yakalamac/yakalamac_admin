<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Abstract;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

abstract class BaseController extends AbstractController
{
    /**
     * @param Request $request
     * @return string
     * @throws Exception
     */
    protected function getCredentials(Request $request): string
    {
        if(NULL === $token = $request->getSession()->get('accessToken')) {
            throw $this->createAccessDeniedException();
        }

        return $token;
    }
}