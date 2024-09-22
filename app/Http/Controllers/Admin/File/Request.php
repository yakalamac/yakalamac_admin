<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http\Controllers\Admin\File;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Console\Application;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Response as HttpResponse;

class Request
{
    public const DEFAULT_FLAG = 0;
    public const MULTIPART_FLAG = 1;

    /**
     * @param string $url
     * @param mixed|null $body
     * @return HttpResponse|PromiseInterface|Application|Response|JsonResponse|ResponseFactory
     * @throws ConnectionException
     */
    private static function multipartHandler(string $url , mixed $body = null): HttpResponse|Application|Response|JsonResponse|ResponseFactory|PromiseInterface
    {
        if(array_key_exists('fileAs', $body) && array_key_exists('file_name', $body) && array_key_exists('file', $body) && array_key_exists('data', $body))
        {
            if($body && !is_array($body['data']))
                return response()->json(
                    [
                        "message" => "Data should be an array",
                        "status" => 400
                    ],
                    400
                )
                    ->header('Content-Type', 'application/json');
            else
                $body['data'] = [];

           return Http::asMultipart()->withOptions(
                [
                    'verify' => false
                ]
            )->attach(
                $body['fileAs'],
                file_get_contents($body['file']),
                $body['file_name']
            )->post($url, $body['data']);
        }
        return response()->json(
            [
                "message" => "Data or file is not exists",
                "status" => 400
            ],
            400
        )
            ->header('Content-Type', 'application/json');
    }

    /**
     * @param string $url
     * @param string $method
     * @param mixed|null $data
     * @param ?array $header
     * @param int $requestFlag
     * @return HttpResponse|Application|Response|JsonResponse|ResponseFactory|PromiseInterface
     * @throws ConnectionException
     */
    public static function httpConnection(string $url, string $method = 'GET', mixed $data = null, ?array $header = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ], int $requestFlag = self::DEFAULT_FLAG
    ): HttpResponse|Application|Response|JsonResponse|ResponseFactory|PromiseInterface
    {
        $response = match ($requestFlag) {
            self::DEFAULT_FLAG => Http::withHeaders($header ?? [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ])->withOptions
            (
                [
                    'verify' => false
                ]
            )->$method($url, $data),
            self::MULTIPART_FLAG => self::multipartHandler($url, $data),
            default => response()->json(
                [
                    "message" => "Invalid flag type provided",
                    "status" => 400
                ],
                400
            )
                ->header('Content-Type', 'application/json'),
        };

        if($response instanceof Response)
        {
            $contentType =  $response->header('Content-Type');
                return response()->json(
                    [
                        'message' => str_contains($contentType, 'application/json')
                            ? $response->json() : $response->body(),
                        'status' =>  $response->status()
                    ]
                    , $response->status()
                )
                    ->header('Content-Type', $contentType);
        }
        return response()->json(
            [
                "message" => "Invalid response type provided",
                "status" => 400
            ],
            400
        )
            ->header('Content-Type', 'application/json');
    }
}
