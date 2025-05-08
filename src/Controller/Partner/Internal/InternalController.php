<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Internal;

use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class InternalController extends AbstractPartnerController
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
    #[Route('/_partner/active/place', name: '_partner_active_place')]
    public function active_place(Request $request): Response
    {
        $place = NULL;

        if($request->isMethod('POST') && $request->getContentTypeFormat() === 'json') {
            $this->__init($request);

            $content = $request->getContent();

            if(json_validate($content) && json_last_error() === JSON_ERROR_NONE) {

                $content = json_decode($content, true);

                if(!empty($content['place']) && is_string($content['place'])) {
                    $business = $this->user->getBusinessRegistration();
                    if($business->hasPlace($content['place'])  || $business->hasManagedPlace($content['place'])) {
                        $place = $content['place'];
                    }
                }
            }
        } else {
            $place = $this->getActivePlace($request);
        }

        if($place === NULL) {
            return $this->json(['message' => 'No valid place found.'],404);
        }

        $place = $this->client->get("places/$place");

        return $this->client->toResponse($place);
    }
}