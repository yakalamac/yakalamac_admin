<?php

namespace App\Http\Controllers\Admin\File;

class ElasticsearchBodyMaker
{
    public static function byAddress(string $search, int $page, int $size)
    {
        return [
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
        ];
    }
}
