<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Public\Ownership;

use App\Client\ElasticaClient;
use App\Controller\Abstract\BaseController;
use App\DTO\ApiUser;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

#[Route('/ownership', name: 'app_public_ownership', methods: ['GET', 'POST'])]
class OwnershipController extends BaseController
{
    /**
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ElasticaClient $client) {}

    /**
     * @param Request $request
     * @return Response
     * @throws Throwable
     * @throws TransportExceptionInterface
     */
    public function __invoke(Request $request): Response
    {
        $data = $this->extractData($request);

        if(empty($data['pid'])) {
            return $this->redirect($request->headers->get('referer', '/'));
        }

        $twigComponents = ['pid' => $data['pid']];

        // Store user locally
        $user = $this->getUser();

        if ($user instanceof ApiUser)
        {
            if(!empty($data['uid'])) {
                return $this->redirect($request->headers->get('referer', '/'));
            }

            $this->handleUser($twigComponents, $user);
        }

        if(!empty($data['uid'])) {
            $twigComponents['uid'] = $data['uid'];
        }

        $this->prepareResponseComponents($twigComponents);

        return $this->render('public/ownership/index.html.twig', $twigComponents);
    }

    /**
     * @param $components
     * @param ApiUser $user
     * @return void
     * @throws Exception
     */
    private function handleUser(&$components, ApiUser $user): void
    {
        $components['uid'] = $user->getUserIdentifier();

        if($user->isBusiness() && isset($components['pid']))
        {
            $business = $user->getBusinessRegistration();

            if($business->hasPlace($components['pid']) && $business->hasManagedPlace($components['pid'])) {
                throw new Exception('Place already has ownership');
            }
        }
    }

    /**
     * @param $components
     * @return void
     * @throws TransportExceptionInterface
     * @throws Throwable
     */
    private function prepareResponseComponents(&$components): void
    {
        if(isset($components['pid']))
        {
            $response = $this->client->document($components['pid'], 'place');

            if(!$this->client->isSuccess($response)) {
                throw new Exception('Not found');
            }

            $components['pid'] = $this->client->toArray($response);
        }
    }
}