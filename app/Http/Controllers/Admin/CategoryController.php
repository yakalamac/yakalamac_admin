<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryAddRequest;
use App\Traits\HttpTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    use HttpTrait;

    public function index()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $categories = [];
        $endpoint = '/api/category/sources';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $categories = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.categories.index', compact('categories', 'total', 'endpoint', 'page'));
    }

    public function add()
    {
        return view('admin.categories.add');
    }

    public function edit($uuid)
    {
        $endpoint = '/api/category/sources/' . $uuid;

        $category =  Cache::remember('category_' . $uuid, 125000, function () use ($endpoint) {
            return $this->httpConnection('application/json', 'get', $endpoint, []);
        });

        return view('admin.categories.edit', compact('uuid', 'endpoint', 'category'));
    }

    public function addPost(CategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/category/sources', [
            'title' => $request->text,
            'description' => $request->description,
            'icon' => $request->icon
        ]);

        if ($save) {
            Cache::forget('place_categories');

            return back()->with('success', 'Kaynak Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'Kaynak Kaydedilememiştir.');
    }

    public function editPost(CategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/category/sources/' . $request->uuid, [
            'title' => $request->text,
            'description' => $request->description,
            'icon' => $request->icon
        ]);

        if ($save) {
            Cache::forget('category_' . $request->uuid);
            Cache::forget('place_categories');

            return back()->with('success', 'Kaynak Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'Kaynak Kaydedilememiştir.');
    }
}
