<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Interface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface ControllerInterface
{
    public function getCollection(Request $request): Response;

    public function get(Request $request, string|int $id): Response;

    public function post(Request $request): Response;

    public function put(Request $request, string|int $id): Response;

    public function delete(Request $request, string|int $id): Response;

    public function patch(Request $request, string|int $id): Response;
}