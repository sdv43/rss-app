<?php

declare(strict_types=1);


namespace Rss\Element;


class Item
{
    public ?string $title = null;
    public ?string $link = null;
    public ?string $description = null;
    public ?string $author = null;

    /**
     * @var array<Category>
     */
    public array $category = [];
    public ?string $comments = null;
    public ?Enclosure $enclosure = null;
    public ?Guid $guid = null;
    public ?\DateTime $pubDate = null;
    public ?Source $source = null;
}