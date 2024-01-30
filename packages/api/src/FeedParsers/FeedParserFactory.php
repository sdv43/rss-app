<?php

namespace Sdv43\RssApp\FeedParsers;

class FeedParserFactory
{
    public function createParser(string $type, string $link): FeedParserInterface
    {
        switch ($type) {
            case 'rss':
                return new RssFeedParser($link);
            default:
                throw new \Exception('Unknown parser type');
        }

    }
}
