<?php
/**
 * @author Barış Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud\Campaign;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;

class CustomCampaignController extends BaseController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client){}

    /**
     * @return Response
     */
    public function edit(): Response
    {
        //TODO ...
    }

    /**
     * @return Response
     */
    public function add(): Response
    {
        //TODO ...
    }
}