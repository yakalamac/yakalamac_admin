<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    #[Route(
        '/{vueRouting}',
        name: 'index',
        requirements: [
            'vueRouting' => '^(?!_(api|elasticsearch|profiler|wdt)).*'
        ],
        methods: ['GET'])
    ]
    public function admin(): Response
    {
        return $this->render('admin/index.html.twig');
    }

    #[Route('/', name: 'partner')]
    public function partner(): Response
    {
        return $this->render('partner/index.html.twig');
    }
}
