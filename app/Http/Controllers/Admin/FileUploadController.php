<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Traits\HttpTrait;

class FileUploadController extends Controller
{
    use HttpTrait;

    public function index()
    {
        $endpoint = '/api/places';
        $page = request()->get('page') ?? 1;
        $total = 0;
        $places = [];

        if(($search = request()->get('addressSearch')))
        {
            $size = 15; // Adjust pagination size

            $response = $this->httpElastica('application/json', '/place/_search',
                [
                    "query" => [
                        "nested" => [
                            "path" => "address",
                            "query" => [
                                "bool" => [
                                    "should" => [
                                        [
                                            "wildcard" => [
                                                "address.shortAddress" => "*$search*"
                                            ]
                                        ],
                                        [
                                            "wildcard" => [
                                                "address.longAddress" => "*$search*"
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "from" => ($page - 1) * $size, // Pagination,
                    "size" => $size
                ]
            );

            if(array_key_exists('hits', $response) && array_key_exists('hits', $response['hits']))
                foreach($response['hits']['hits'] as $hit)
                {
                    $places[] = $hit['_source'];
                }

            $total = $response['hits']['total']['value'];
        } else {

            $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
            if ($response) {
                $places = $response['hydra:member'];
                $total = $response['hydra:totalItems'];
            }
        }

        return view('admin.file.upload', compact('places', 'total', 'endpoint', 'page'));
    }
}
