<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthLoginRequest;

class AuthController
{
    public function login()
    {
        if(auth('admin')->check()){
            return redirect()->route('admin.dashboard');
        }

        return view('admin.auth.login');
    }


    public function doLogin(AuthLoginRequest $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if(auth('admin')->attempt($credentials, $request->remember)){
            redirect()->route('admin.dashboard');
        }

        return back()->with('error', 'User not found!');
    }

    public function logout()
    {
        auth('admin')->logout();

        return redirect()->route('auth.login');
    }
}
