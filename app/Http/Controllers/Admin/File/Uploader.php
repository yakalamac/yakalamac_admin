<?php

namespace App\Http\Controllers\Admin\File;

use Illuminate\Http\Client\ConnectionException;

trait Uploader
{
    /**
     * @throws ConnectionException
     */
    public static function byUrl(string $url)
    {
        Request::httpConnection('application/json', );
    }
}
