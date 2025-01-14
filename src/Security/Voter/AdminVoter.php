<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Security\Voter;

use App\Security\User\ApiUser;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AdminVoter extends Voter
{
    private const ADMIN_ROLE_MAP = [
        'ADMIN_ENTITY_VIEWER' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR',
            'ROLE_ADMIN_ENTITY_MANAGER', 'ROLE_ADMIN_ENTITY_EDITOR', 'ROLE_ADMIN_VERIFIED'
        ],
        'ADMIN_USER_VIEWER' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR',
            'ROLE_ADMIN_ENTITY_MANAGER', 'ROLE_ADMIN_ENTITY_EDITOR',
        ],
        'ADMIN_ENTITY_EDITOR' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR',
            'ROLE_ADMIN_ENTITY_MANAGER', 'ROLE_ADMIN_ENTITY_EDITOR'
        ],
        'ADMIN_ENTITY_MANAGER' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR',
            'ROLE_ADMIN_ENTITY_MANAGER'
        ],
        'ADMIN_USER_EDITOR' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR'
        ],
        'ADMIN_USER_MANAGER' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER'
        ],
        'ADMIN_SUPER' => [
            'ROLE_ADMIN_SUPER'
        ],
        'ROLE_ADMIN' => [
            'ROLE_ADMIN_SUPER', 'ROLE_ADMIN_USER_MANAGER', 'ROLE_ADMIN_USER_EDITOR', 'ROLE_ADMIN_ENTITY_MANAGER',
            'ROLE_ADMIN_ENTITY_EDITOR', 'ROLE_ADMIN_VERIFIED', 'ROLE_ADMIN_UNVERIFIED', 'ROLE_ADMIN_EMAIL_VERIFIED',
            'ROLE_ADMIN_MOBILE_PHONE_VERIFIED'
        ]
    ];

    protected function supports(string $attribute, mixed $subject): bool
    {
        return isset(self::ADMIN_ROLE_MAP[$attribute]);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof ApiUser) {
            return false;
        }

        $roles = $user->getRoles();

        return count($roles) > 0 && $this->canAccess($attribute, $roles);
    }

    private function canAccess(string $attribute, array $roles): bool
    {
        return count(array_intersect(static::ADMIN_ROLE_MAP[$attribute], $roles)) > 0;
    }
}