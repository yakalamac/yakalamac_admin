<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http;

use Symfony\Component\HttpFoundation\Request;

class Defaults
{
    /**
     * @type int
     */
    public const PAGINATION_SIZE = 15;

    /**
     * @type string
     */
    public const QUERY_PAGINATION = 'limit';

    /**
     * @type string
     */
    public const QUERY_PAGE = 'page';

    /**
     * Generates API client
     * @param ClientFactory $clientFactory
     * @return ClientFactory
     */
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
            ->setBaseUri($_ENV['API_URL']);

        return $clientFactory;
    }

    /**
     * Generates Elasticsearch client
     * @param ClientFactory $clientFactory
     * @return ClientFactory
     */
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
            ->setBaseUri($_ENV['ELASTIC_URL']);

        return $clientFactory;
    }

    /**
     * Generates API Client for file requests
     * @param ClientFactory $clientFactory
     * @return ClientFactory
     */
    public static function forAPIFile(ClientFactory $clientFactory): ClientFactory
    {
        $clientFactory
            ->options()
            ->setBaseUri($_ENV['API_URL'].'/');
//            ->setCaFile(__DIR__.'/../../config/ssl/cacert.pem')
//            ->setCaPath(__DIR__.'/../../config/ssl/cacert.pem')
//            ->verifyPeer(false)
//            ->verifyHost(false);

        return $clientFactory;
    }

    /**
     * Checks request is multipart
     * @param Request $request
     * @return bool
     */
    public static function isMultipart(Request $request): bool
    {
        return str_starts_with($request->headers->get('Content-Type'), 'multipart/form-data');
    }

    /**
     * Returns message from response status code
     * @param int $statusCode
     * @return string
     */
    public static function messageFromStatusCode(int $statusCode): string
    {
        return match (true) {
            $statusCode === 100 => 'Continue',
            $statusCode > 100 && $statusCode < 200 => 'Informational',
            $statusCode === 204 => 'No Content',
            $statusCode > 200 && $statusCode < 300 => 'Success',
            $statusCode > 300 && $statusCode < 400 => 'Redirection',
            $statusCode > 400 && $statusCode < 500 => 'Client Error',
            $statusCode > 500 && $statusCode < 600 => 'Server Error',
            default => 'Unknown'
        };
    }
}