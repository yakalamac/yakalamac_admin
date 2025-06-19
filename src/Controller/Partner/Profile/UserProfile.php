<?php

/**
 * @author Onur Kudret & Alper Uyanık
 * @version 1.0.0
 */

namespace App\Controller\Partner\Profile;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Client\YakalaApiClient;
use App\Controller\Partner\Abstract\AbstractPartnerController;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Throwable;

#[Route('/partner')]
class UserProfile extends AbstractPartnerController
{
    /**
     * @param YakalaApiClient $client
     */
    public function __construct(private readonly YakalaApiClient $client) {}

    /**
     * Handles the user profile page for partners.
     *
     * This method retrieves the active place ID from the request and fetches user data.
     * It then renders the partner user profile template with the retrieved data.
     *
     * @param Request $request The current HTTP request.
     * @return Response The rendered user profile page.
     */
    #[Route('/user_profile', name: 'partner_user_profile')]
    public function index(Request $request): Response
    {
        $placeId = $this->getActivePlace($request);
        $data = $this->user->getData();

        return $this->render('partner/layouts/profile/partner-user-profile.html.twig', [
            'data' => $data,
        ]);
    }

    /**
     * Handles the password change request for the partner user.
     *
     * This method receives a JSON payload containing the old password, new password,
     * and new password confirmation. It validates the input, constructs the necessary
     * data, and sends a request to the API service to change the user's password.
     *
     * Route: /partner/change/password
     * Name: partner_change_password
     *
     * @param Request $request The HTTP request object containing the password data.
     * 
     * @throws Exception If there is no data to update.
     * 
     * @return Response The response from the API service after attempting to change the password.
     */
    #[Route('/change/password', name: 'partner_change_password')]
    public function changePassword(Request $request)
    {

        $placeId = $this->getActivePlace($request);
        $payload = json_decode($request->getContent(), true);
        $oldPassword = $payload['oldPassword'] ?? null;
        $newPassword = $payload['newPassword'] ?? null;
        $newPasswordConfirm = $payload['newPasswordConfirm'] ?? null;

        if (isset($payload['newPassword'])) {
            $data['newPassword'] = $payload['newPassword'];
        }

        if (isset($payload['oldPassword'])) {
            $data['oldPassword'] = $payload['oldPassword'];
        }

        if (isset($payload['newPasswordConfirm'])) {
            $data['newPasswordConfirm'] = $payload['newPasswordConfirm'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }

        $userId = $this->user->getUserIdentifier();
        $userURI = "/api/users/$userId";

        $response = $this->client->post('action/change/password', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type'  => 'application/ld+json',
                'Accept'        => 'application/ld+json',

            ],
            'json' => [
                'oldPassword'        => $oldPassword,
                'newPassword'        => $newPassword,
                'newPasswordConfirm' => $newPasswordConfirm,
                'application'        => 'YAKALA',
                'user'               => $userURI,
            ]
        ]);

        return $this->client->toResponse($response);
    }

    /**
     * Handles the request to change the user's mobile phone number.
     *
     * Route: /partner/change/number (partner_change_number)
     *
     * This method receives a JSON payload containing the new phone number,
     * validates the input, and sends a request to update the user's mobile phone number.
     * Throws an exception if no data is provided for update.
     *
     * @param Request $request The HTTP request object containing the payload.
     * @return Response The response from the client after attempting to change the mobile phone number.
     * @throws Exception If there is no data to update.
     */
    #[Route('/change/number', name: 'partner_change_number')]
    public function changePhone(Request $request)
    {
        $placeId = $this->getActivePlace($request);
        $payload = json_decode($request->getContent(), true);
        $mobilePhone = $payload['phoneNumber'] ?? null;

        if (isset($payload['phoneNumber'])) {
            $data['phoneNumber'] = $payload['phoneNumber'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }

        $userId = $this->user->getUserIdentifier();
        $userURI = "/api/users/$userId";
        $userData = $this->user->getData();
        $oldMobilePhone = $userData['mobilePhone'];
        $response = $this->client->post('action/change/mobile-phone', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type'  => 'application/ld+json',
                'Accept'        => 'application/ld+json',

            ],
            'json' => [
                'user' => $userURI,
                'newMobilePhone' => $mobilePhone,
                'oldMobilePhone' => $oldMobilePhone,
            ]
        ]);
        return $this->client->toResponse($response);
    }

    /**
     * Verifies a user's mobile phone number using a verification code and token.
     *
     * This endpoint expects a JSON payload containing the phone number, verification token,
     * and the verification code. It validates the input, constructs the required data,
     * and sends a POST request to the verification service to verify the mobile phone.
     *
     * @param Request $request The HTTP request containing the verification data.
     * @return Response The response from the verification service.
     *
     * @throws Exception If there is no data to update.
     */
    #[Route('/verification/verify/phone', 'verify_phone')]
    public function verifyPhone(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true);
        $mobilePhone = $payload['phoneNumber'] ?? null;
        $verificationToken = $payload['verificationToken'] ?? null;
        $code = $payload['code'] ?? null;

        $data = [];

        if (isset($payload['mobilePhone'])) {
            $data['mobilePhone'] = $payload['mobilePhone'];
        }

        if (isset($payload['verificationToken'])) {
            $data['verificationToken'] = $payload['verificationToken'];
        }

        if (isset($payload['code'])) {
            $data['code'] = $payload['code'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }


        $response = $this->client->post('action/verification/verify/mobile-phone', [
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Accept' => 'application/ld+json'
            ],
            'json' => [
                'smsCode' => $code,
                'mobilePhone' => $mobilePhone,
                'verificationToken' => $verificationToken,
            ]
        ]);

        return $this->client->toResponse($response);;
    }

    /**
     * Handles the request to change the email address of the currently authenticated user.
     *
     * Route: /partner/change/email (name: partner_change_email)
     *
     * - Retrieves the active place from the request.
     * - Validates and extracts the new email address from the request payload.
     * - Throws an exception if no data is provided for update.
     * - Sends a POST request to the backend API to update the user's email address.
     * - Returns the API response.
     *
     * @param Request $request The HTTP request object containing the payload.
     * @return Response The response from the backend API.
     * @throws Exception If no data is provided to update.
     */
    #[Route('/change/email', name: 'partner_change_email')]
    public function changeEmail(Request $request)
    {
        $placeId = $this->getActivePlace($request);
        $payload = json_decode($request->getContent(), true);
        $email = $payload['email'] ?? null;

        $data = [];

        if (isset($payload['email'])) {
            $data['email'] = $payload['email'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }

        $userId = $this->user->getUserIdentifier();
        $userURI = "/api/users/$userId";
        $response = $this->client->post('action/change/email', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Content-Type'  => 'application/ld+json',
                'Accept'        => 'application/ld+json',

            ],
            'json' => [
                'user' => $userURI,
                'newEmailAddress' => $email,
            ]
        ]);
        return $this->client->toResponse($response);
    }

    /**
     * Handles the email verification process.
     *
     * This method receives a JSON payload containing the user's email, verification token,
     * and verification code. It validates the presence of these fields, constructs a data array,
     * and sends a POST request to the verification endpoint. If no valid data is provided,
     * an exception is thrown.
     *
     * Route: /partner/verification/verify/email
     * Route Name: verify_email
     *
     * @param Request $request The HTTP request containing the JSON payload.
     * @return Response The HTTP response from the verification endpoint.
     * @throws Exception If no data is provided for verification.
     */
    #[Route('/verification/verify/email', 'verify_email')]
    public function verifyEmail(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true);
        $email = $payload['email'] ?? null;
        $verificationToken = $payload['verificationToken'] ?? null;
        $code = $payload['code'] ?? null;

        $data = [];

        if (isset($payload['email'])) {
            $data['email'] = $payload['email'];
        }

        if (isset($payload['verificationToken'])) {
            $data['verificationToken'] = $payload['verificationToken'];
        }

        if (isset($payload['code'])) {
            $data['code'] = $payload['code'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }

        $response = $this->client->post('action/verification/verify/email', [
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Accept' => 'application/ld+json'
            ],
            'json' => [
                'code' => $code,
                'email' => $email,
                'verificationToken' => $verificationToken,
            ]
        ]);

        return $this->client->toResponse($response);;
    }

    /**
     * Updates the profile information of the currently authenticated user.
     *
     * If no updatable fields are provided in the payload, an Exception is thrown.
     * The method sends a PATCH request to the user service to update the user's profile.
     *
     * @param Request $request The HTTP request containing the JSON payload.
     * @return Response The response from the user service after updating the profile.
     * @throws Exception If there is no data to update.
     */
    #[Route('/update/profile', 'update_profile')]
    public function updateProfile(Request $request)
    {
        $placeId = $this->getActivePlace($request);
        $payload = json_decode($request->getContent(), true);

        $data = [];
        if (isset($payload['firstName'])) {
            $data['firstName'] = $payload['firstName'];
        }
        if (isset($payload['lastName'])) {
            $data['lastName'] = $payload['lastName'];
        }
        if (isset($payload['birthDate'])) {
            $data['birthDate'] = $payload['birthDate'];
        }
        if (isset($payload['imageUrl'])) {
            $data['imageUrl'] = $payload['imageUrl'];
        }

        if (empty($data)) {
            throw new Exception("Güncellenecek veri yok.");
        }

        $userId = $this->user->getUserIdentifier();

        $response = $this->client->patch("users/$userId", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->user->getAccessToken(),
                'Accept' => 'application/ld+json',
                'Content-Type' => 'application/merge-patch+json'
            ],
            'json' => $data
        ]);

        return $this->client->toResponse($response);
    }
}
