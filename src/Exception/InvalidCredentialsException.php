<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Exception;

use Exception;
use Throwable;

class InvalidCredentialsException extends Exception
{
    /**
     * @param $message
     * @param Throwable|null $previous
     */
    public function __construct($message = "Credentials were not found or invalid.", Throwable $previous = NULL)
    {
        parent::__construct($message, 400, $previous);
    }
}