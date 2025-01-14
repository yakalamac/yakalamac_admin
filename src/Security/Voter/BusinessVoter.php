<?php

namespace App\Security\Voter;

//use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class BusinessVoter extends Voter
{
    const ACCESS_ADMIN_PANEL = 'access_admin_panel';
    const VIEW_CATEGORY = 'view_category';
    const ADD_CATEGORY = 'add_category';
    const EDIT_CATEGORY = 'edit_category';
    const DELETE_CATEGORY = 'delete_category';

    //public function __construct(private readonly LoggerInterface $logger) {}

    protected function supports(string $attribute, $subject): bool
    {
        $supportedAttributes = [
            self::ACCESS_ADMIN_PANEL,
            self::VIEW_CATEGORY,
            self::ADD_CATEGORY,
            self::EDIT_CATEGORY,
            self::DELETE_CATEGORY,
        ];

        return in_array($attribute, $supportedAttributes, true);
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        /** @var UserInterface $user */
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        return match ($attribute) {
            self::ACCESS_ADMIN_PANEL, self::DELETE_CATEGORY =>
                in_array('ROLE_SUPER_ADMIN', $user->getRoles(), true),
            self::VIEW_CATEGORY, self::ADD_CATEGORY, self::EDIT_CATEGORY =>
                in_array('ROLE_SUPER_ADMIN', $user->getRoles(), true) ||
                in_array('ROLE_EDITOR_ADMIN', $user->getRoles(), true),
            default => false,
        };
    }
}
