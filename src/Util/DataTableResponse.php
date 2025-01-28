<?php
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

namespace App\Util;
/**
 * @deprecated
 */
class DataTableResponse
{
    public static function build(int $draw, int $recordsTotal, int $recordsFiltered, array $data, ?string $error): array
    {
        return [
            'draw' => $draw,
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data' => $data,
            'error' => $error
        ];
    }
}