<?php

declare(strict_types=1);


namespace Rss\Element;


class Image
{
    public string $url;
    public string $title;
    public string $link;
    public ?int $width = null;
    public ?int $height = null;
    public ?string $description = null;
}