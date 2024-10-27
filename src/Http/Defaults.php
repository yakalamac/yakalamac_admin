<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http;

class Defaults
{
    public const PAGINATION_SIZE = 15;
    public const QUERY_PAGINATION = 'limit';
    public const QUERY_PAGE = 'page';

    public static function forAPI(ClientFactory $clientFactory): ClientFactory
    {
        $clientFactory
            ->options()
            ->setHeaders(
                [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]
            )
            ->setBaseUri('https://api.yaka.la');

        return $clientFactory;
    }

    public static function forElasticsearch(ClientFactory $clientFactory): ClientFactory
    {
        $clientFactory
            ->options()
            ->setHeaders(
                [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]
            )
            ->setBaseUri('https://es.yaka.la');

        return $clientFactory;
    }
}