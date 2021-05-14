<?php

declare(strict_types=1);


namespace Storage;


class Connection extends \PDO
{
    private function __construct()
    {
        parent::__construct(
            "sqlite:{$_ENV["SQLITE_DB"]}",
            null,
            null,
            [
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ],
        );
    }

    public static function getInstance(): static
    {
        return new static();
    }
}