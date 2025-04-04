<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Provider;

use App\Http\Client;
use App\Http\Defaults;
use App\Interface\ClientManagerInterface;

class ElasticaManagerProvider
{
    /**
     * @var iterable
     */
    private iterable $managers;

    /**
     * @var Client
     */
    private Client $client;

    /**
     * @param iterable $managers
     * @param Client $client
     */
    public function __construct(iterable $managers, Client $client)
    {
        $this->managers = $managers;
        $this->client = Defaults::forElasticsearch($client);
    }

    /**
     * @param string $tag
     * @return ClientManagerInterface|null
     */
    public function get(string $tag): ?ClientManagerInterface
    {
        foreach ($this->managers as $manager) {
            if($manager->equals($tag)) {
                return $manager->init($this->client);
            }
        }

        return NULL;
    }
}