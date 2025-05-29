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

class ElasticaSearchManager extends AbstractClientManager
{
    /**
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ElasticaClient $client) {}

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

        $draw = NULL;
        if(isset($query['draw'])) {
            $draw = $query['draw'];
            unset($query['draw']);
        }

        $response = $this->client->toResponse(
            $this->client->search($subject, $query)
        );

        if($response->isSuccessful() && $draw !== NULL) {
            $array = json_decode($response->getContent(), true);
            $array['draw'] = $draw;
            $response->setContent(json_encode($array));
        }

        return $response;
    }

    /**
     * @return string
     */
    protected function getTag(): string
    {
        return 'elastica.search';
    }
}