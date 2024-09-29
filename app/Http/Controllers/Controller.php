<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\Request;

abstract class Controller
{
    public abstract function add();
    public abstract function collection();
    public abstract function edit(Request $request, int $id);
}
