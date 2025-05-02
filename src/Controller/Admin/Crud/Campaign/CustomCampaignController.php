<?php

namespace App\Controller\Admin\Crud\Campaign;

use App\Client\YakalaApiClient;
use Symfony\Component\HttpFoundation\Response;

class CustomCampaignController
{
    public function __construct(private readonly YakalaApiClient $client){}

    public function edit(): Response{
        //TODO ...
    }

    public function add(): Response{
        //TODO ...
    }

}