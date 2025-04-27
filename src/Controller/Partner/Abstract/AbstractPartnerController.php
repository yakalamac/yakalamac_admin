<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Abstract;

use App\Controller\Abstract\BaseController;
use App\DTO\ApiUser;
use Symfony\Component\HttpFoundation\Request;

class AbstractPartnerController extends BaseController
{
    protected ?ApiUser $user = NULL;

    protected function __init(Request $request): void
    {
        if($this->user !== NULL) {
            return;
        }

        $user = $this->getUser();

        if(!$user instanceof ApiUser) {
            throw $this->createAccessDeniedException('Not authorized');
        }

        if(!$user->isBusiness()) {
            throw $this->createAccessDeniedException('Not authorized');
        }

        $this->user = $user;
    }

    /**
     * @param Request $request
     * @return string|null
     */
    protected function getActivePlace(Request $request): ?string
    {
        $this->__init($request);

        $activePlace = $request->cookies->get('_active_place');

        if($activePlace !== NULL) {
            json_validate($activePlace);

            if(json_last_error() === JSON_ERROR_NONE)
            {
                $activePlace = json_decode($activePlace, true);

                if(count(array_intersect(['pid','bid','pname','uid'],array_keys($activePlace))) !== 4) {
                    return NULL;
                }

                if($activePlace['uid'] !== $this->user->getUserIdentifier()) {
                    return NULL;
                }

                $business = $this->user->getBusinessRegistration();

                if($activePlace['bid'] !== $business->getId()) {
                    return NULL;
                }


                if($business->hasPlace($activePlace['pid']) || $business->hasManagedPlace($activePlace['pid'])) {
                    return $activePlace['pid'];
                }
            }
        }

        return NULL;
    }
}