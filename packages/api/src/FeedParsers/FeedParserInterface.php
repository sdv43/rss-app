<?php

namespace Sdv43\RssApp\FeedParsers;

interface FeedParserInterface
{
    public function parse(): void;

    public function getFeed(): Feed | null;

    /**
     * @return FeedStory[]
     */
    public function getStories(): array;
}
