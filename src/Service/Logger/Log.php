<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Service\Logger;

use App\DTO\ApiUser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\Logger;

readonly class Log
{
    public static function write(
        Logger $logger,
        Request     $request,
        Response    $response,
        ?\Throwable $exception = null,
        string $message='NULL'
    ): void
    {
        $logLevel = match (true) {
            $response->isServerError() || $exception !== NULL => 'emergency',
            $response->isClientError() => 'error',
            $response->isSuccessful(), $response->isRedirection(), $response->isInformational() => 'info',
            $response->isForbidden() => 'warning',
            $response->isNotFound() => 'notice',
            $response->isInvalid() => 'critical'
        };
        $logMessage ="
        METHOD={$request->getMethod()}\n
        URI={$request->getRequestUri()}\n
        IP={$request->getClientIp()}\n
        STATUS_CODE={$response->getStatusCode()}\n
        LEVEL=$logLevel\n
        SCHEME={$request->getScheme()}\n
        MESSAGE={$message}\n
        ENV={$_ENV['APP_ENV']}\n
        ";

        $user = $request->getSession()->get('_api_user');

        if($user instanceof ApiUser) {
            $logMessage.="
            USER={$user->getUserIdentifier()}\n
            ADMIN={$user->isAdmin()}\n
            BUSINESS={$user->isBusiness()}\n
            ";
        }

        if($exception !== NULL) {
            $logMessage.="
            EXCEPTION_EXISTS=TRUE\n
            EXCEPTION_MESSAGE={$exception->getMessage()}\n
            EXCEPTION_LINE={$exception->getLine()}\n
            EXCEPTION_CODE={$exception->getCode()}\n
            EXCEPTION=
            ".$exception::class."\n";
        } else {
            $logMessage.="EXCEPTION_EXISTS=FALSE";
        }

        $logger->log($logLevel, $logMessage);
    }
}