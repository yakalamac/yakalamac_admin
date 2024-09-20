<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountCategoryAddRequest;
use App\Traits\HttpTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AccountController extends Controller
{
    use HttpTrait;

    public function index()
    {
        $page = request()->get('page') ?? 1;
        $total = 0;
        $accounts = [];
        $endpoint = '/api/category/accounts';

        $response = $this->httpConnection('application/json', 'get', $endpoint, ['page' => $page]);
        if ($response) {
            $accounts = $response['hydra:member'];
            $total = $response['hydra:totalItems'];
        }

        return view('admin.accounts.index', compact('accounts', 'total', 'endpoint', 'page'));
    }

    public function add()
    {
        return view('admin.accounts.add');
    }

    public function edit($uuid)
    {
        $endpoint = '/api/category/accounts/' . $uuid;

        $category =  Cache::remember('category_' . $uuid, 125000, function () use ($endpoint) {
            return $this->httpConnection('application/json', 'get', $endpoint, []);
        });

        return view('admin.accounts.edit', compact('uuid', 'endpoint', 'category'));
    }

    public function addPost(AccountCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/json', 'post', '/api/category/accounts', [
            'title' => $request->title,
            'description' => $request->description,
            'icon' => $request->icon
        ]);

        if ($save) {
            Cache::forget('place_accounts');

            return back()->with('success', 'Hesap Kategorisi Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'Hesap Kategorisi Kaydedilememiştir.');
    }

    public function editPost(AccountCategoryAddRequest $request)
    {
        $save = $this->httpConnection('application/merge-patch+json', 'patch', '/api/category/accounts/' . $request->uuid, [
            'title' => $request->title,
            'description' => $request->description,
            'icon' => $request->icon
        ]);

        if ($save) {
            Cache::forget('category_' . $request->uuid);
            Cache::forget('place_accounts');

            return back()->with('success', 'Hesap Kategorisi Başarıyla Kaydedilmiştir.');
        }

        return back()->with('error', 'Hesap Kategorisi Kaydedilememiştir.');
    }

    public function delete($uuid)
    {
        $delete = $this->httpConnection('application/json', 'delete', '/api/category/accounts/' . $uuid, []);

        if ($delete) {
            return back()->with('success', 'Hesap Kategorisi Silinmiştir.');
        }

        return back()->with('error', 'Hesap Kategorisi silinirken sorun oluştu. Tekrar deneyiniz!');
    }
}
