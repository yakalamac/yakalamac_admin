<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationMailAddRequest;
use App\Http\Requests\NotificationPushAddRequest;
use App\Http\Requests\NotificationSmsAddRequest;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sms()
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.sms', compact('notifications', 'total', 'page'));
    }

    public function addSms()
    {
        return view('admin.notifications.add_sms');
    }

    public function addPostSms(NotificationSmsAddRequest $request) {}

    public function push()
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.push', compact('notifications', 'total', 'page'));
    }

    public function addPush()
    {
        return view('admin.notifications.add_push');
    }

    public function addPostPush(NotificationPushAddRequest $request) {}
    
    public function mail()
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.mail', compact('notifications', 'total', 'page'));
    }

    public function addMail()
    {
        return view('admin.notifications.add_mail');
    }

    public function addPostmail(NotificationMailAddRequest $request) {}
}
