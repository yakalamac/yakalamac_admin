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
    /**
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response;

    /**
     * @param Request $request
     * @param string|int $id
     * @return Response
     */

    public function edit(Request $request, string|int $id): Response;

    /**
     * @param Request $request
     * @return Response
     */
    public function add(Request $request): Response;
}