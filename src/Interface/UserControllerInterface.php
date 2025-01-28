<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Interface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface UserControllerInterface
{
    /**
     * Application name
     * @return string
     */
    public function applicationName(): string;

    /**
     * Returns base path of `UserControllerInterface`
     * @return string
     */
    public function basePath(): string;

    /**
     * Index controller of user controller
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response;

    /**
     * Get users path
     * @param Request $request
     * @return Response
     */
    public function getUsers(Request $request): Response;

    /**
     * Add user controller
     * @param Request $request
     * @return Response
     */
    public function addUser(Request $request): Response;

    /**
     * Edit user path
     * @param Request $request
     * @return Response
     */
    public function editUser(Request $request): Response;

    /**
     * Delete user path
     * @param Request $request
     * @return Response
     */
    public function deleteUser(Request $request): Response;

    /**
     * User detail path
     * @param Request $request
     * @param string|int $id
     * @return Response
     */
    public function detailUser(Request $request, string|int $id): Response;
}