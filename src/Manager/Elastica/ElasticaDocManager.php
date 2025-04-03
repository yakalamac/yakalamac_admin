<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Manager\Abstract\AbstractClientManagerManager;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaDocManager extends AbstractClientManagerManager
{
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

        if($this->client === NULL) {
            throw new Exception('Elasticsearch document manager not initialized.');
        }

        $response = $this->client->request("/$index/_doc/$subject");

        return $this->handleResponse($response);
    }
}