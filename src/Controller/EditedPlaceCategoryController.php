<?php

namespace App\Controller;

use App\Entity\EditedPlaceCategory;
use App\Repository\EditedPlaceCategoryRepository;
use App\Service\AuditLogService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/admin/edited-place/cat', name: 'admin_edited_place_cat_')]
class EditedPlaceCategoryController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private EditedPlaceCategoryRepository $editedPlaceCategoryRepository;
    private AuditLogService $auditLogService;

    public function __construct(
        EntityManagerInterface $entityManager,
        EditedPlaceCategoryRepository $editedPlaceCategoryRepository,
        AuditLogService $auditLogService
    ) {
        $this->entityManager = $entityManager;
        $this->editedPlaceCategoryRepository = $editedPlaceCategoryRepository;
        $this->auditLogService = $auditLogService;
    }

    #[Route('/', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $placeId = $data['place_id'] ?? null;

        if (!$placeId) {
            return $this->json(['error' => 'place_id is required'], Response::HTTP_BAD_REQUEST);
        }

        $existing = $this->editedPlaceCategoryRepository->findOneBy(['placeId' => $placeId]);
        if ($existing) {
            return $this->json(['error' => 'Already exists'], Response::HTTP_CONFLICT);
        }

        $editedPlaceCat = new EditedPlaceCategory();
        $editedPlaceCat->setPlaceId($placeId);
        $editedPlaceCat->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($editedPlaceCat);
        $this->entityManager->flush();

        /** @var \App\Security\User\ApiUser $user */
        $user = $this->getUser();
        $userData = $user->getData();
        $userName2 = sprintf(
            '%s %s',
            $userData['firstName'] ?? 'Bilinmiyor',
            $userData['lastName'] ?? 'Bilinmiyor'
        );

        $additionalData = [
            'newData' => [
                'place_id' => $placeId,
            ],
            'userName' => $userName2,
        ];

        $this->auditLogService->log(
            $user ? $user->getUserIdentifier() : 'bilinmiyor',
            $placeId,
            'selectedCat',
            "api/places/{$placeId}",
            $additionalData
        );

        return $this->json(['success' => true], Response::HTTP_CREATED);
    }

    #[Route('/{placeId}', name: 'delete', methods: ['DELETE'])]
    public function delete(string $placeId): JsonResponse
    {
        $editedPlaceCat = $this->editedPlaceCategoryRepository->findOneBy(['placeId' => $placeId]);

        if (!$editedPlaceCat) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($editedPlaceCat);
        $this->entityManager->flush();

        /** @var \App\Security\User\ApiUser $user */
        $user = $this->getUser();
        $userData = $user->getData();
        $userName2 = sprintf(
            '%s %s',
            $userData['firstName'] ?? 'Bilinmiyor',
            $userData['lastName'] ?? 'Bilinmiyor'
        );

        $additionalData = [
            'newData' => [
                'place_id' => $placeId,
            ],
            'userName' => $userName2,
        ];

        $this->auditLogService->log(
            $user ? $user->getUserIdentifier() : 'bilinmiyor',
            $placeId,
            'unselectedCat',
            "api/places/{$placeId}",
            $additionalData
        );

        return $this->json(['success' => true], Response::HTTP_OK);
    }
}
