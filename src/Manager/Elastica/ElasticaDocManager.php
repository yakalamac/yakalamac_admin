<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Client\ElasticaClient;
use App\Manager\Abstract\AbstractClientManager;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaDocManager extends AbstractClientManager
{
    /**
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ElasticaClient $client) {}

    /**
     * @param $subject
     * @param string|null $index
     * @return Response
     * @throws Throwable
     */
    public function manage($subject, ?string $index = NULL): Response
    {
        if(!(is_string($index) && is_string($subject))) {
            throw new Exception('Subject must be string. Index must be declared.');
        }

        return $this->client->document($subject, $index);
    }

    protected function getTag(): string
    {
        return 'elastica.doc';
    }
}