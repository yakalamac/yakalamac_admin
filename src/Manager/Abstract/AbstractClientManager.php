<?php
/**
 * @author Barış Kudret
 * @version 1.0.0
 */

namespace App\Manager\Abstract;

use App\Interface\ClientManagerInterface;

abstract class AbstractClientManager implements ClientManagerInterface
{
    protected abstract function getTag(): string;

    /**
     * @param string $tag
     * @return bool
     */
    public function equals(string $tag): bool { return $tag === $this->getTag(); }
}