<?php

namespace Sdv43\RssApp\Services;

final class Storage extends \PDO
{
    private static Storage|null $instance = null;

    private function __construct()
    {
        parent::__construct(
            'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'] . ';charset=utf8mb4',
            $_ENV['DB_USER'],
            $_ENV['DB_PASS'],
        );
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new Storage();
        }

        return self::$instance;
    }
}
