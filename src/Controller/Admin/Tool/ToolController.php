<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller\Admin\Tool;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ToolController extends AbstractController
{
    /**
     * @return Response
     */
    #[Route('/admin/tool/converter', name: 'app_admin_tool_converter')]
    public function index(): Response
    {
        return $this->render('/admin/pages/tool/converter.html.twig');
    }
}