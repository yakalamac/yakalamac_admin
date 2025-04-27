<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Crud\Finance;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/partner/finance')]
class FinanceController extends BaseController
{

    #[Route('/payments', name: 'partner_finance_payments')]
    public function payments()
    {
        return new Response();
    }

    #[Route('/taxing', name: 'partner_finance_taxing')]
    public function taxing()
    {
        return new Response();
    }

    #[Route('/order_groups', name: 'partner_finance_order_groups')]
    public function order_groups()
    {
        return new Response();
    }

}