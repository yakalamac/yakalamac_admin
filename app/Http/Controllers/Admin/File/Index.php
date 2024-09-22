<?php

namespace App\Http\Controllers\Admin\File;

use Illuminate\View\View;


trait Index
{
    /**
     * @return View
     */
    public function index(): View
    {
//        $page = request()->get('page') ?? 1;
//        $total = 0;
//        $places = [];
//
//        if(($search = request()->get('addressSearch')))
//        {
//            $size = 15; // Adjust pagination size
//
//            $response = Request::httpConnection('https://es.yaka.la/place/_search', 'POST',
//                ElasticsearchBodyMaker::byAddress($search, $page, $size)
//            );
//            if($response->successful())
//            {
//                $content = $response->getData();
//                if(!is_array($content) && json_validate($content = $response->getContent()))
//                    $content = json_decode($content, true);
//                else
//                    $content = [];
//
//                if(array_key_exists('hits', $content) && array_key_exists('hits', $content['hits']))
//                    foreach($content['hits']['hits'] as $hit)
//                        {
//                            $places[] = $hit['_source'];
//                        }
//
//                    $total = $content['hits']['total']['value'];
//            }
//        }
//        else {
//            $response = Request::httpConnection("https://api.yaka.la/api/places?page=$page");
//            if ($response->isSuccessful()) {
//                $places = $response->getData();
//                $total = count($response->getData());
//            }
//        }
        return view('admin.file.upload'); //compact('places', 'total',  'page')
    }

}
