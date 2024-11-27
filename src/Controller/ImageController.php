<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ImageController extends AbstractController
{
    #[Route('/_image', name: 'app_image_post_send', methods: ['POST'])]
    public function index(Request $request): Response
    {
        $url = $request->toArray()['url'];

        $client = HttpClient::create();

        $response = $client->request('GET', $url);

        if ($response->getStatusCode() === 200) {
            $imageContent = $response->getContent(false);
            $contentType = $response->getHeaders()['content-type'][0];

            return new Response(
                $imageContent,
                200,
                [
                    'Content-Type' => $contentType,
                    'Content-Disposition' => 'inline; filename="image.jpg"',
                ]
            );
        }
        return new Response('Failed to retrieve the image', 400);
    }
}
