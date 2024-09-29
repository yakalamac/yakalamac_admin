<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Http\Controllers\Admin\Place;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Illuminate\Contracts\View\Factory;
use Illuminate\Foundation\Application;

class PlaceCuisineCategory extends Controller
{
    public function collection(Request $request): Application|Factory|View
    {
        return view('admin.categories.place_cuisine.collection');
    }

    public function edit(Request $request, int $id): View|Factory|Application
    {
        return view('admin.categories.place_cuisine.edit', compact('id'));
    }

    public function add(Request $request): Application|Factory|View
    {
        return view('admin.categories.place_cuisine.add');
    }
}
