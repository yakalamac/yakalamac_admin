<?php

namespace App\Controller;

use App\Entity\EditedPlace;
use App\Repository\EditedPlaceRepository;
use App\Service\AuditLogService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/admin/edited-place', name: 'admin_edited_place_')]
class EditedPlaceController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private EditedPlaceRepository $editedPlaceRepository;
    private AuditLogService $auditLogService;

    public function __construct(
        EntityManagerInterface $entityManager,
        EditedPlaceRepository $editedPlaceRepository,
        AuditLogService $auditLogService
    ) {
        $this->entityManager = $entityManager;
        $this->editedPlaceRepository = $editedPlaceRepository;
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
        $editedPlace = new EditedPlace();
        $editedPlace->setPlaceId($placeId);
        $editedPlace->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($editedPlace);
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
            'selected',
            "api/places/{$placeId}",
            $additionalData
        );

        return $this->json(['success' => true], Response::HTTP_CREATED);
    }

    #[Route('/{placeId}', name: 'delete', methods: ['DELETE'])]
    public function delete(string $placeId): JsonResponse
    {
        $editedPlace = $this->editedPlaceRepository->findOneBy(['placeId' => $placeId]);

        if (!$editedPlace) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($editedPlace);
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
           'unselected',
           "api/places/{$placeId}",
           $additionalData
       );


        return $this->json(['success' => true], Response::HTTP_OK);
    }
}
