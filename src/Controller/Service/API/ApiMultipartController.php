<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Service\API;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Exception;
use Symfony\Component\HttpClient\HttpOptions;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Mime\Part\TextPart;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

class ApiMultipartController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client){}

    /**
     * @param Request $request
     * @param string $route
     * @return Response
     * @throws Throwable
     */
    #[Route('/_multipart/{route}', requirements: ['route' => '.+'] ,methods: ['GET','PUT', 'PATCH', 'DELETE','POST'])]
    public function post(Request $request, string $route): Response
    {
        // Loop through data to extract also values
        $data = array_map(fn($value)=>new TextPart($value),$request->request->all());

        // Extract files from request, merge with data
        $data = array_merge($data, $this->extractFiles($request));

        // Create new form data
        $form = new FormDataPart($data);

        $options = (new HttpOptions())
            //Set form data options with authentication token
            ->setBody($form->bodyToString())
            // Set Content-Type using form (Not pass manually multipart/form-data)
            ->setHeader('Content-Type', $form->getMediaType())
            // Re-set headers from form
            ->setHeaders($form->getPreparedHeaders()->toArray());

        $response = $this->client->post($route, $options->toArray());

        $status = $response->getStatusCode();

        $data = [
            ...$this->client->toArray($response),
            'success' => $this->client->isSuccess($response)
        ];

        if($data['success'] === FALSE) {
            $data['errordesc'] = 'An error occurred while processing your request';
            $data['errorcode'] = $status;
        }

        return new JsonResponse($data, $status, $response->getHeaders(false));
    }

    /**
     * @param Request $request
     * @return array
     * @throws Exception
     */
    private function extractFiles(Request $request): array
    {
        $files = [];
        /**
         * @var UploadedFile $file
         */
        // Loop through files
        foreach ($request->files->all() as $file) {

            if(empty($file->getPath())) {
                throw new Exception("No valid file path for {$file->getClientOriginalName()} {$file->getClientOriginalExtension()} {$file->getSize()}");
            }

            if(str_contains($file->getClientMimeType(), 'video')) {
                return [
                    'file' => DataPart::fromPath($file->getPathname(), $file->getClientOriginalName(), $file->getMimeType())
                ];
            }

            $files[$file->getPathname()] = DataPart::fromPath($file->getPathname(), $file->getClientOriginalName(), $file->getMimeType());
        }

        return $files;
    }
}