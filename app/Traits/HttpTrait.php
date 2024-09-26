<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait HttpTrait
{
    public function httpConnection($header = 'application/json', $method = 'get', $endpoint, $data): array|bool|null
    {
        $customData = [];

        if ($header == 'multipart/form-data') {
            if (!empty($data['category'])) {
                $customData = [
                    [
                        'name' => 'category',
                        'contents' => $data['category']
                    ],
                    [
                        'name' => 'caption',
                        'contents' => $data['caption']
                    ],
                    [
                        'name' => 'showOnBanner',
                        'contents' => $data['showOnBanner']
                    ]
                ];
            }

            $response = Http::asMultipart()->withOptions([
                'verify' => false //__DIR__.'/ssl/cacert-2024-07-02.pem' // Disable SSL certificate verification (not recommended for production)
            ])->attach(
                'file',
                file_get_contents($data['file']),
                $data['file_name']
            )->$method(env('DEV_API_URL') . $endpoint, $customData);
        } else {
            $response = Http::withHeaders([
                'Content-Type' => $header
            ])->withOptions([
                'verify' => false //__DIR__.'/ssl/cacert-2024-07-02.pem' // Disable SSL certificate verification (not recommended for production)
            ])->$method(env('DEV_API_URL') . $endpoint, $data);
            
        }
         
        if ($response->successful() || ($method == 'delete' && $response->noContent())) {
            return $response->json() ?? true;
        }
        return $response->body();
        //return false;
    }

    /**
     * @param $header
     * @param $method
     * @param $endpoint
     * @param $data
     * @return array|bool|null
     */
    public function httpElastica($header = 'application/json', $endpoint, $data): array|bool|null
    {
        $response = Http::withHeaders([
            'Content-Type' => $header
        ])->withOptions([
            'verify' => false //__DIR__.'/ssl/cacert-2024-07-02.pem' // Disable SSL certificate verification (not recommended for production)
        ])->post('es.yaka.la' . $endpoint, $data);

        if ($response->successful() && !$response->noContent()) {
            return $response->json() ?? true;
        }
        return false;
    }
}
