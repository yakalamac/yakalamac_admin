<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    /**
     * @return TwigFilter[]
     */
    public function getFilters(): array
    {
        return [
            new TwigFilter('json_decode', [$this, 'json_decode']),
        ];
    }

    /**
     * @param $str
     * @return mixed
     */
    public function json_decode($str): mixed
    {
        return json_decode($str, true);
    }
}