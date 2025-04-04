<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\User;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ADMIN_USER_EDITOR')]
class UserController extends BaseController
{
    #[Route('/admin/users', name: 'users')]

    public function index(Request $request): Response
    {
        return $this->render('admin/pages/user/user.html.twig');
    }
}