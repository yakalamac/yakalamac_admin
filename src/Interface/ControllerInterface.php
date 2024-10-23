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

    public function edit(Request $request, string|int $id);

    public function add(Request $request);

    public function delete(Request $request, string|int $id);
}