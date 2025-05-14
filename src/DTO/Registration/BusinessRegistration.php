<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\DTO\Registration;

use App\DTO\Entity\Place;
use App\DTO\Registration\Abstract\AbstractRegistration;

class BusinessRegistration extends AbstractRegistration
{
    /**
     * @var Place[]
     */
    private array $managedPlaces = [];

    /**
     * @var Place[]
     */
    private array $places = [];

    /**
     * @return void
     */
    protected function init(): void
    {
        $this->data['roles'][] = 'ROLE_BUSINESS';

        $this->managedPlaces = array_map(function ($data) {
            return new Place($data, $this);
        },$this->data['managedPlaces'] ?? []);

        $this->places = array_map(function ($data) {
            return new Place($data, $this);
        },$this->data['places'] ?? []);
    }

    /**
     * @return string[]
     */
    public function getRoles(): array
    {
        return $this->data['roles'] ?? ['ROLE_BUSINESS'];
    }

    /**
     * @return Place[]
     */
    public function getPlaces(): array
    {
        return $this->places;
    }

    /**
     * @return Place[]
     */
    public function getManagedPlaces(): array
    {
        return $this->managedPlaces;
    }

    /**
     * @param string|array $place
     * @return bool
     */
    public function hasPlace(string|array $place): bool
    {
        return $this->findPlace($this->places, $place) !== NULL;
    }

    /**
     * @param string|array $place
     * @return bool
     */
    public function hasManagedPlace(string|array $place): bool
    {
        return $this->findPlace($this->managedPlaces, $place) !== NULL;
    }

    /**
     * @param Place[] $collection
     * @param array|string $place
     * @return Place|null
     */
    private function findPlace(array $collection, array|string $place): ?Place
    {
        if(is_array($place)) {
            $place = $place['id'];
        }

        foreach ($collection as $current) {
            if ($current->getId() === $place) {
                return $current;
            }
        }

        return NULL;
    }

    /**
     * @return ?Place
     */
    public function getFirstPlace(): ?Place
    {
        if(count($places = $this->places) > 0) {
            return $places[0];
        }

        if(count($places = $this->managedPlaces) > 0) {
            return $places[0];
        }

        return NULL;
    }
}