<?php

namespace App\Factory;

use App\DTO\UserDTO;
use Exception;

class UserFactory
{
    /**
     * @param $array
     * @return ?UserDTO
     * @throws Exception
     */
    public static function fromResponseArray($array): ?UserDTO
    {
        $user = new UserDTO();

        if(array_key_exists('id', $array))
            $user->id = $array['id'];

        if(array_key_exists('username', $array))
            $user->username = $array['username'];

        if(array_key_exists('email', $array))
            $user->email = $array['email'];

        if(array_key_exists('roles', $array) && is_array($array['roles']))
            $user->roles = $array['roles'];

        if(array_key_exists('data', $array))
            $user->data = (object)$array['data'];

        if(array_key_exists('firstName', $array))
            $user->firstName = $array['firstName'];

        if(array_key_exists('lastName', $array))
            $user->lastName = $array['lastName'];

        if(array_key_exists('adminRegistration', $array))
            $user->addRegistration(
                RegistrationFactory::fromResponseArray(
                    $array['adminRegistration'],
                    1
                )
            );

        if(array_key_exists('businessRegistration', $array))
            $user->addRegistration(
                RegistrationFactory::fromResponseArray(
                    $array['businessRegistration'],
                    2
                )
            );

        if(array_key_exists('yakalaRegistration', $array))
            $user->addRegistration(
                RegistrationFactory::fromResponseArray(
                    $array['yakalaRegistration'],
                    3
                )
            );

        return $user;
    }

}