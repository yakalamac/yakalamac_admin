<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Partner\Product;

use App\Client\ElasticaClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use App\Controller\Service\API\ApiMultipartController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

class ProductPhotoController extends AbstractPartnerController
{
    /**
     * @param ApiMultipartController $controller
     * @param ElasticaClient $client
     */
    public function __construct(private readonly ApiMultipartController $controller, private readonly ElasticaClient $client) {}

    /**
     * @param Request $request
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/partner/products/{id}/photo', name: 'partner_product_photo', requirements: ['id'=>'.+'], methods: ['POST'])]
    public function add(Request $request, string $id): Response
    {
        if($request->files->count() === 0) {
            return new Response('No file to upload.',400);
        }

        $this->__init($request);

        $this->validate($id);

        return $this->controller->post($request, "product/photos");
    }

    /**
     * @param string $productId
     * @return void
     * @throws Throwable
     * @throws TransportExceptionInterface
     */
    public function validate(string $productId): void
    {
        $result = $this->client->document($productId, 'product');

        if(!$this->client->isSuccess($result)) {
            throw new Exception(json_encode($this->client->toArray($result)));
        }

        $array = $this->client->toArray($result);

        if(isset($array['found']) && is_bool($array['found']) && !$array['found']) {
            throw new Exception('Product not found.');
        }

        if(NULL === $array['_source']['place'] ?? NULL) {
            throw new Exception('Validation failed.');
        }

        if(is_array($array['_source']['place']) && isset($array['_source']['place']['id'])) {
            $id = $array['_source']['place']['id'];
            $business = $this->user->getBusinessRegistration();

            if($business->hasPlace($id) || $business->hasManagedPlace($id)) {
                return;
            }

            throw new Exception('Validation failed. Place is not belong to your business.');
        }

        throw new Exception('Validation failed. No place found for this product.');
    }
}