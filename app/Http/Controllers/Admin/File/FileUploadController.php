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

class FileUploadController extends Controller
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
            $request->get('url'), $request->get('method'), $request->get('data'), $request->get('header')
        );
    }

}
