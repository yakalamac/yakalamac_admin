<?php
/**
 * @author Kıvanç Hançerli
 * @version 1.0.0
 */

namespace App\Controller\Logger;

use App\Controller\Abstract\BaseController;
use App\Controller\Admin\Logger\ChangelogType;
use App\DTO\ApiUser;
use App\Entity\Log\Changelog;
use App\Repository\Log\ChangelogRepository;
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
    /**
     * @param Request $request
     * @param EntityManagerInterface $em
     * @param ChangelogRepository $changelogRepository
     * @return Response
     */
    #[Route('/admin/changelogs', name: 'admin_changelog_index')]
    public function changelogs(Request $request, EntityManagerInterface $em, ChangelogRepository $changelogRepository): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $changelog = new Changelog();
        $form = $this->createForm(ChangelogType::class, $changelog);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid())
        {
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

    /**
     * @param Request $request
     * @param Changelog $changelog
     * @param EntityManagerInterface $em
     * @return Response
     */
    #[Route('/admin/changelogs/{id}/delete', name: 'admin_changelog_delete', methods: ['POST'])]
    public function deleteChangelog(Request $request, Changelog $changelog, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete-changelog' . $changelog->getId(), $request->request->get('_token')))
        {
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
        if(
            isset($content['type']) && $content['type'] === 'mobilePhone' &&
            isset($content['mobilePhone']) && isset($content['verificationToken'])
        ) {
            $response = $this->userService
                ->completeMobilePhoneVerification($content['smsCode'], $content['verificationToken'], $content['mobilePhone'], $user);

            $status = $response->getStatusCode();

            return new JsonResponse(
                data: $status > 199 && $status < 300 ?$response->toArray(false) : $response->getContent(false),
                status: $status
            );
        }

        return $this->json(['error' => 'Bad request.'], 400);
    }
}