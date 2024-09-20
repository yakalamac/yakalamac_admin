<?php

use Platformsh\ConfigReader\Config;

$config = new Config();

if($config->isValidPlatform())
{
    $database = $config->hasRelationship('postgresql') ? $config->credentials('postgresql') : null;

    if($database)
    {
        putenv("DB_CONNECTION=pgsql");
        putenv("DB_USERNAME=".$database['username']);
        putenv("DB_PASSWORD=".$database['password']);
        putenv("DB_HOST=".$database['host']);
        putenv("DB_PORT=".$database['port']);
        putenv("DB_DATABASE=".$database['path']);

        $dsn = sprintf(
            'pgsql://%s:%s@%s:%s/%s',
            $database['username'],
            $database['password'],
            $database['host'],
            $database['port'],
            ltrim($database['path'], '/')
        );
        putenv('DB_URL=' . $dsn);
    }

    $redis = $config->hasRelationship('redis') ? $config->credentials('redis') : null;

    if($redis)
    {
        putenv("REDIS_CLIENT=predis");
        putenv("REDIS_HOST=".$redis['host']);
        putenv("REDIS_PASSWORD=".$redis['password']);
        putenv("REDIS_PORT=".$redis['port']);
    }
}
