<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Util;

class ArrayUtil
{

    /**
     * @param array|null $needle
     * @param array ...$arrays
     * @return bool
     */
    public static function in_array_any(?array $needle, array ...$arrays): bool
    {
        if (empty($needle)) {
            return false;
        }

        return array_intersect($needle, ...$arrays) !== [];
    }

    /**
     * @param array|null $needle
     * @param array ...$arrays
     * @return bool
     */
    public static function in_array_all(?array $needle, array ...$arrays): bool
    {
        if (empty($needle)) {
            return false;
        }

        return array_diff($needle, ...$arrays) === [];
    }
}