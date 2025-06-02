<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Finance;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/partner/finance')]
class FinanceController extends BaseController
{
    /**
     * @return Response
     */
    #[Route('/payments', name: 'partner_finance_payments')]
    public function payments(): Response
    {
        // TODO
        return new Response();
    }

    /**
     * @return Response
     */
    #[Route('/taxing', name: 'partner_finance_taxing')]
    public function taxing(): Response
    {
        // TODO
        return new Response();
    }

    /**
     * @return Response
     */
    #[Route('/order_groups', name: 'partner_finance_order_groups')]
    public function order_groups(): Response
    {
        // TODO
        return new Response();
    }
}