<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Throwable;

class DictionaryController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client){}
    /**
     * @return Response
     */
    #[Route("/admin/dictionary",  name: 'app_dictionary')]
    public function index(): Response
    {
        return $this->render('admin/pages/dictionary/index.html.twig');
    }

    /**
     * @param string $id
     * @return Response
     * @throws Throwable
     */
    #[Route('/admin/dictionary/detail/{id}', name: 'app_dictionary_detail')]
    public function detail(string $id): Response{

        $response = $this->client->get("dictionaries/$id");

        return  $this->render('admin/pages/dictionary/edit.html.twig', [
            'dictionary' => $this->client->toArray($response)
        ]);
    }
}