<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Manager\Elastica;

use App\Manager\Abstract\AbstractClientManager;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ElasticaSearchManager extends AbstractClientManager
{
    /**
     * @param $subject
     * @param array $query
     * @return Response
     * @throws Throwable
     */
    public function manage($subject, array $query = []): Response
    {
        if(!is_string($subject)) {
            throw new Exception('Subject must be a index-name string');
        }

        if(isset($query['draw'])) {
            $draw = $query['draw'];
            unset($query['draw']);
        }

        $response = $this->client->request("$subject/_search", 'POST', $query);

        return $this->handleResponse($response, ['key' => 'draw', 'value' => $draw ?? 1]);
    }

    protected function getTag(): string
    {
        return 'elastica.search';
    }
}