<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Illuminate\Contracts\View\Factory;
use Illuminate\Foundation\Application;

abstract class Controller
{
    public abstract function add(Request $request): View|Factory|Application;
    public abstract function collection(Request $request): View|Factory|Application;
    public abstract function edit(Request $request, int $id): View|Factory|Application;
}
