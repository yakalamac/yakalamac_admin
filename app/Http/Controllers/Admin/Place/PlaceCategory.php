<?php

namespace App\Http\Controllers\Admin\Place;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

class PlaceCategory extends Controller
{

    public function add(Request $request): View|Factory|Application
    {
        return view('admin.categories.place.add');
    }

    public function collection(Request $request): View|Factory|Application
    {
        return view('admin.categories.place.collection');
    }

    public function edit(Request $request, int $id): View|Factory|Application
    {
        return view('admin.categories.place.edit', compact('id'));
    }
}
