<?php

namespace App\Interface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface UserControllerInterface
{

    public function applicationName(): string;

    public function index(Request $request): Response;


    public function edit(Request $request): Response;

    public function getUsers(Request $request): Response;

    public function addUser(Request $request): Response;

    public function editUser(Request $request): Response;

    public function deleteUser(Request $request): Response;
}