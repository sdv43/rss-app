<?php

declare(strict_types=1);


namespace Rss\Element;


class Cloud
{
    public string $domain;
    public int $port;
    public string $path;
    public string $registerProcedure;
    public string $protocol;
}