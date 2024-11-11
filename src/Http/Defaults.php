<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http;

use Symfony\Component\HttpFoundation\Request;
use function PHPUnit\Framework\any;

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

    public static function forAPIFile(ClientFactory $clientFactory): ClientFactory
    {
        $clientFactory
            ->options()
            ->setBaseUri('https://api.yaka.la/');
//            ->setCaFile(__DIR__.'/../../config/ssl/cacert.pem')
//            ->setCaPath(__DIR__.'/../../config/ssl/cacert.pem')
//            ->verifyPeer(false)
//            ->verifyHost(false);

        return $clientFactory;
    }


    public static function isMultipart(Request $request): bool
    {
        return str_starts_with($request->headers->get('Content-Type'), 'multipart/form-data');
    }
}