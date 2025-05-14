<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Promotion\Opportunity;

use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RegularOpportunityController extends AbstractPartnerController
{
    #[Route('/partner/opportunity/regular', name:'partner_opportunity_regular')]
    public function index(): Response
    {

    }
}