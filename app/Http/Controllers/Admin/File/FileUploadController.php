<?php

namespace App\Http\Controllers\Admin\File;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeneralRequest;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Foundation\Application;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;

class FileUploadController
{
    use Index;

    /**
     * @param GeneralRequest $request
     * @return HttpResponse|Response|JsonResponse|ResponseFactory|PromiseInterface
     * @throws ConnectionException
     */
    public function makeRequest(GeneralRequest $request): HttpResponse|Response|JsonResponse|ResponseFactory|PromiseInterface
    {
        return Request::httpConnection(
            mb_convert_encoding($request->get('url'), 'UTF-8', 'UTF-8'),
            $request->get('method'),
            str_contains($request->headers->get('Content-Type'), 'application/json')
                ? $request->get('data')
                : $request->all(),
            $request->get('header'),
            $request->get('flag')
        );
    }

}
