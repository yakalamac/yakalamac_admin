<?php
/**
 * @author Barış Kudret
 * @version 1.0.0
 */

namespace App\Interface;

interface ClientManagerInterface
{
    /**
     * Checks provided tag name equals to client manager tag name
     * @param string $tag
     * @return bool
     */
    public function equals(string $tag): bool;

    /**
     * Manages service subject with custom processes
     * @param $subject
     * @return mixed
     */
    public function manage($subject): mixed;
}