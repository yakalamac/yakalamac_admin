<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Abstract;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\DTO\ApiUser;

abstract class BaseController extends AbstractController
{
    /**
     * @param Request $request
     * @return string
     * @throws Exception
     */
    protected function getCredentials(Request $request): string
    {
        $user = $this->getUser();

        if($user instanceof ApiUser) {
            if(NULL !== $token = $user->getAccessToken()) {
                return $token;
            }
        }

        throw $this->createAccessDeniedException();
    }

    /**
     * @param Request $request
     * @return array
     */
    protected function extractData(Request $request): array
    {
        if($request->isMethod('GET') || $request->isMethod('PATCH')) {
            return $request->query->all();
        }

        $data = match ($request->getContentTypeFormat()) {
            'json' => $request->toArray(),
            'form' => $request->request->all()
        };

        $queries = $request->query->all();

        return [...$data, ...$queries];
    }
}