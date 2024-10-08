<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    #[Route(
        '/{vueRouting}',
        name: 'index',
        requirements: [
            'vueRouting' => '^(?!_(route|profiler|wdt)).*'
        ],
        methods: ['GET'])
    ]
    public function admin(Request $request): Response
    {
//        if(!$session->isStarted())
//            $session->start();
//
//
//        if(!$request->getSession()->isStarted())
//        {
//            $request->getSession()->start();
//            $request->getSession()->setName('random');
//            $session->set('random', $request->getClientIp());
//        }

        return $this->render('admin/index.html.twig');
    }

    #[Route('/', name: 'partner')]
    public function partner(): Response
    {
        return $this->render('partner/index.html.twig');
    }
}
