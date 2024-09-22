<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationMailAddRequest;
use App\Http\Requests\NotificationPushAddRequest;
use App\Http\Requests\NotificationSmsAddRequest;
use Illuminate\Contracts\View\View;
use Illuminate\Contracts\View\Factory;
use Illuminate\Foundation\Application;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class NotificationController extends Controller
{
    public function sms(): View|Factory|Application
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.sms', compact('notifications', 'total', 'page'));
    }

    public function addSms(): View|Factory|Application
    {
        return view('admin.notifications.add_sms');
    }

    public function addPostSms(NotificationSmsAddRequest $request) {}

    public function push(): View|Factory|Application
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.push', compact('notifications', 'total', 'page'));
    }

    public function addPush(): View|Factory|Application
    {
        return view('admin.notifications.add_push');
    }

    public function addPostPush(NotificationPushAddRequest $request) {}

    /**
     * @return View|Factory|Application
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function mail(): View|Factory|Application
    {
        $notifications = [];
        $page = request()->get('page') ?? 1;
        $total = 0;

        return view('admin.notifications.mail', compact('notifications', 'total', 'page'));
    }

    public function addMail(): View|Factory|Application
    {
        return view('admin.notifications.add_mail');
    }

    public function addPostmail(NotificationMailAddRequest $request) {}
}
