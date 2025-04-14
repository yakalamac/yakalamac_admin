<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Crud;

use App\Client\YakalaApiClient;
use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ADMIN_USER_EDITOR')]
class UserController extends BaseController
{
    public function __construct(private readonly YakalaApiClient $client)
    {
    }
    #[Route('/admin/users', name: 'users')]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/user/user.html.twig');
    }

    #[Route('/admin/users/detail/{id}', name: 'user_detail')]
    public function detail(Request $request, string $id): Response
    {
        $response = $this->client->get("users/$id");
        //throw new \Exception('fdgg');
        return $this->render('admin/pages/user/edit.html.twig', [
            'user' => $this->client->toArray($response),
        ]);
    }
}