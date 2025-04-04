<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Elasticsearch;

use App\Interface\ClientManagerInterface;
use App\Provider\ElasticaManagerProvider;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class ElasticsearchController extends AbstractController
{
    public function __construct(private readonly ElasticaManagerProvider $managerProvider) {}

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    #[Route('/_autocomplete', name: 'elastica_autocomplete', methods: ['GET'])]
    public function autocomplete(Request $request): JsonResponse
    {
        $searchTerm = $request->query->get('q', '');

        if (strlen($searchTerm) < 2) return new JsonResponse(['results' => []], Response::HTTP_OK);

        return $this->getManager('elastica.autocomplete')->manage($searchTerm);
    }

    /**
     * @param string $index
     * @param string $id
     * @return Response
     * @throws Exception
     */
    #[Route('/_document/{index}/{id}', name: 'elastica_doc', methods: ['GET'])]
    public function document(string $index, string $id): Response
    {
        return $this->getManager('elastica.doc')->manage($index, $id);
    }

    /**
     *
     * @param Request $request
     * @param string $index
     * @return JsonResponse
     * @throws Exception
     */
    #[Route('/_search/{index}', name: 'elastica_search', methods: ['GET', 'POST'])]
    public function search(Request $request, string $index): JsonResponse
    {
        if($request->isMethod('POST')) {
            if($request->getContentTypeFormat() === 'form') {
                $query = $request->request->all();
            } else {
                $query = $request->toArray(false);
            }
        } else {
            $query = $request->query->all();
        }

        return $this->getManager('elastica.search')->manage($index, $query);
    }

    /**
     * TODO OK
     * @param Request $request
     * @param string $index
     * @return Response
     * @throws Throwable
     */
    #[Route('/_text/{index}', name: 'elastica_text', methods: ['GET', 'POST'])]
    public function text(Request $request, string $index): Response
    {
        $text = $request->query->get('q', '');
        $size = $request->query->get('size', 15);
        $from = $request->query->get('from', 0);

        return $this->getManager('elastica.text')->manage($text, $index, $size, $from);
    }

    /**
     * Prevent code repetition
     * @param string $tag
     * @return ClientManagerInterface
     * @throws Exception
     */
    private function getManager(string $tag): ClientManagerInterface
    {
        $manager = $this->managerProvider->get($tag);

        if($manager === NULL) {
            throw new Exception('Manager not found');
        }

        return $manager;
    }
}