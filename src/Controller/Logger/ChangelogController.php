<?php

namespace App\Controller\Admin\Log;

use App\Controller\Abstract\BaseController;
use App\DTO\ApiUser;
use App\Entity\Changelog;
use App\Repository\ChangelogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ChangelogController extends BaseController
{

    #[Route('/admin/changelogs', name: 'admin_changelog_index')]
    public function changelogs(Request $request, EntityManagerInterface $em, ChangelogRepository $changelogRepository): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $changelog = new Changelog();
        $form = $this->createForm(ChangelogType::class, $changelog);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $changelog->setCreatedAt(new \DateTime());

            $em->persist($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla eklendi.');

            return $this->redirectToRoute('admin_changelog_index');
        }

        $changelogs = $changelogRepository->findBy([], ['createdAt' => 'DESC']);

        return $this->render('admin/pages/system/change-logs.html.twig', [
            'form' => $form->createView(),
            'changelogs' => $changelogs,
        ]);
    }

    #[Route('/admin/changelogs/{id}/delete', name: 'admin_changelog_delete', methods: ['POST'])]
    public function deleteChangelog(Request $request, Changelog $changelog, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete-changelog' . $changelog->getId(), $request->request->get('_token'))) {
            $em->remove($changelog);
            $em->flush();

            $this->addFlash('success', 'Güncelleme notu başarıyla silindi.');
        } else {
            $this->addFlash('error', 'Güncelleme notu silinirken bir hata oluştu.');
        }

        return $this->redirectToRoute('admin_changelog_index');
    }

    /**
     * @param array $content
     * @param ApiUser $user
     * @return Response
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    private function verificateOTP(array $content, ApiUser $user): Response
    {
        if(isset($content['type']) && $content['type'] === 'mobilePhone' &&
            isset($content['mobilePhone']) && isset($content['verificationToken'])
        ) {
            $response = $this->userService->completeMobilePhoneVerification($content['smsCode'], $content['verificationToken'], $content['mobilePhone'], $user);
            $status = $response->getStatusCode();
            if($status > 199 && $status < 300) {
                return new JsonResponse($response->toArray(false), Response::HTTP_OK);
            } else {
                return new JsonResponse($response->getContent(false), Response::HTTP_OK);
            }
        }

        return new Response('Bad request.', Response::HTTP_BAD_REQUEST);
    }
}