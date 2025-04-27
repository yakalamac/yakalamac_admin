<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Order;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/partner/order')]
class OrderController extends BaseController
{
    /**
     * @return Response
     */
    #[Route('/zones', name: 'partner_order_zones')]
    public function zones(): Response
    {
        return $this->render('partner/layouts/order/zones.html.twig');
    }

    #[Route('/waiting', name: 'partner_order_waiting')]
    public function waiting(): Response
    {
        return new Response();
    }

    #[Route('/cancelled', name: 'partner_order_cancelled')]
    public function cancelled(): Response
    {
        return new Response();
    }

    #[Route('/customer/reqs', name: 'partner_order_customer_requests')]
    public function customer_requests(): Response
    {
        return new Response();
    }

    #[Route('/history', name: 'partner_order_history')]
    public function history(): Response
    {
        return new Response();
    }
}