<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Provider;

use App\Http\ClientFactory;
use App\Http\Defaults;
use App\Interface\ClientManagerInterface;

class ElasticaManagerProvider
{
    /**
     * @var iterable
     */
    private iterable $managers;

    /**
     * @var ClientFactory
     */
    private ClientFactory $client;

    /**
     * @param iterable $managers
     * @param ClientFactory $client
     */
    public function __construct(iterable $managers, ClientFactory $client)
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