<?php

namespace App\Factory;

use App\DTO\RegistrationDTO;

class RegistrationFactory
{
    /**
     * @param $array
     * @param int $registrationType
     * @return RegistrationDTO|null
     */
    public static function fromResponseArray($array, int $registrationType): ?RegistrationDTO
    {
        $registration = new RegistrationDTO($registrationType);

        if(array_key_exists('username', $array))
            $registration->username = $array['username'];
        if(array_key_exists('data', $array))
            $registration->data = (object)$array['data'];
        if(array_key_exists('roles', $array))
            $registration->roles = $array['roles'];
        if(array_key_exists('id', $array))
            $registration->id = $array['id'];

        return $registration;
    }

}