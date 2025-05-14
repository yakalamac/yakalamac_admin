<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Provider;

use App\Interface\ClientManagerInterface;

class ElasticaManagerProvider
{
    /**
     * @var iterable
     */
    private iterable $managers;

    /**
     * @param iterable $managers
     */
    public function __construct(iterable $managers)
    {
        $this->managers = $managers;
    }

    /**
     * @param string $tag
     * @return ClientManagerInterface|null
     */
    public function get(string $tag): ?ClientManagerInterface
    {
        foreach ($this->managers as $manager) {
            if($manager->equals($tag)) {
                return $manager;
            }
        }

        return NULL;
    }
}