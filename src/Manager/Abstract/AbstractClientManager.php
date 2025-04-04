<?php
/**
 * @author Barış Kudret
 * @version 1.0.0
 */

namespace App\Manager\Abstract;

use App\Http\Client;
use App\Interface\ClientManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Throwable;

abstract class AbstractClientManager implements ClientManagerInterface
{
    /**
     * @var Client|null
     */
    protected ?Client $client = NULL;

    protected abstract function getTag(): string;

    /**
     * @param string $tag
     * @return bool
     */
    public function equals(string $tag): bool { return $tag === $this->getTag(); }

    /**
     * @param Client $client
     * @return $this
     */
    public function init(Client $client): static
    {
        if($this->client === NULL) {
            $this->client = $client;
        }

        return $this;
    }

    /**
     * @param ResponseInterface $response
     * @param array ...$args
     * @return Response|null
     * @throws Throwable
     */
    protected function handleResponse(ResponseInterface $response, array ...$args): ?Response
    {
        $status = $response->getStatusCode();
        $data = $response->toArray(false);

        if($status !== Response::HTTP_OK) {
            $data['status'] = $status;
        } else if(!empty($args)) {
            foreach($args as $arg) {
                if(! (isset($arg['key']) && isset($arg['value']))) {
                    throw new \Exception("Missing argument 'key' and 'value' keys.");
                }
                $data[$arg['key']] = $arg['value'];
            }
        }

        return new JsonResponse(data: $data, status: $status);
    }
}