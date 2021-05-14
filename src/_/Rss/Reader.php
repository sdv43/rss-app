<?php

declare(strict_types=1);


namespace Rss;


use GuzzleHttp\Client;
use Rss\Element\Category;
use Rss\Element\Channel;
use Rss\Element\Image;
use Rss\Element\Item;

class Reader
{
    public function read(string $url): Channel
    {
        $g = new Client();

        $xml = $g->get($url)->getBody()->getContents();

        #
        libxml_use_internal_errors(false);

        $rss = simplexml_load_string($xml);

        if ($rss === false) {
            throw new ReaderException("Error on parse xml");
        }

        #
        if ($rss->getName() !== "rss") {
            throw new ReaderException("Root tag name must be 'rss'");
        }

        return $this->processChannel($rss);
    }

    private function processChannel(\SimpleXMLElement $rss): Channel
    {
        if (count($rss->channel) !== 1) {
            throw new ReaderException("Tag rss must contain one channel");
        }
        if (count($rss->channel->title) !== 1) {
            throw new ReaderException("Tag channel must contain one title");
        }
        if (count($rss->channel->link) !== 1) {
            throw new ReaderException("Tag channel must contain one link");
        }
        if (count($rss->channel->description) !== 1) {
            throw new ReaderException("Tag channel must contain one description");
        }

        $channel = new Channel();

        $channel->title = (string)$rss->channel->title;
        $channel->link = (string)$rss->channel->link;
        $channel->description = (string)$rss->channel->description;
        $channel->image = $this->processImage($rss->channel);
        $channel->items = $this->processStories($rss->channel);

        // todo process optional elements

        return $channel;
    }

    private function processImage(\SimpleXMLElement $channel): ?Image
    {
        if (count($channel->image) === 0) {
            return null;
        }

        if (count($channel->image->url) !== 1) {
            throw new ReaderException("Tag image must contain one url");
        }
        if (count($channel->image->title) !== 1) {
            throw new ReaderException("Tag image must contain one title");
        }
        if (count($channel->image->link) !== 1) {
            throw new ReaderException("Tag image must contain one link");
        }

        $image = new Image();

        $image->url = (string)$channel->image->url;
        $image->title = (string)$channel->image->title;
        $image->link = (string)$channel->image->link;

        // todo process other optional elements

        return $image;
    }

    private function processStories(\SimpleXMLElement $channel): array
    {
        $stories = [];

        foreach ($channel->item as $item) {
            $story = new Item();

            if (!(count($item->title) === 1 || count($item->description) === 1)) {
                throw new ReaderException("Tag item must contain one title or one description");
            }

            $story->title = count($item->title) ? (string)$item->title : null;
            $story->link = count($item->link) ? (string)$item->link : null;
            $story->description = count($item->description) ? (string)$item->description : null;
            $story->author = count($item->author) ? (string)$item->author : null;
            $story->pubDate = count($item->pubDate) ? new \DateTime((string)$item->pubDate) : null;

            foreach ($item->category as $cat) {
                $category = new Category();

                $category->value = (string)$cat;
                $category->domain = (string)$cat["domain"] ?: null;

                $story->category[] = $category;
            }

            // todo process other optional elements

            $stories[] = $story;
        }

        return $stories;
    }
}