<?php

declare(strict_types=1);


namespace Rss\Element;


class Channel
{
    public string $title;
    public string $link;
    public string $description;
    public ?string $language = null;
    public ?string $copyright = null;
    public ?string $managingEditor = null;
    public ?string $webMaster = null;
    public ?\DateTime $pubDate = null;
    public ?\DateTime $lastBuildDate = null;
    public ?Category $category = null;
    public ?string $generator = null;
    public ?string $docs = null;
    public ?Cloud $cloud = null;
    public ?int $ttl = null;
    public ?Image $image = null;
    public ?TextInput $textInput = null;
    public ?array $skipHours = null;
    public ?array $skipDays = null;

    /**
     * @var array<Item>
     */
    public array $items = [];
}