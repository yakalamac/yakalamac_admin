<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Promotion\Opportunity;

use App\Controller\Partner\Abstract\AbstractPartnerController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SnapOpportunityController extends AbstractPartnerController
{

    #[Route('/partner/opportunity/snap', name:'partner_opportunity_snap')]
    public function index(): Response
    {

    }
}