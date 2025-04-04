<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Dictionary;

use App\Controller\Abstract\BaseController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DictionaryController extends BaseController
{
    #[Route("/admin/dictionary",  name: 'app_dictionary')]
    public function index(): Response
    {
        return $this->render('admin/pages/product/dictionary.html.twig');
    }
}