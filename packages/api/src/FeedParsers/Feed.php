<?php

namespace Sdv43\RssApp\FeedParsers;

class Feed
{
    public string|null $name = null;

    public string|null $description = null;

    public string|null $site = null;

    public string|null $imageUrl = null;
    
    public int|null $pubDate = null;
}
