<?php

namespace Sdv43\RssApp\FeedParsers;

class RssFeedParser implements FeedParserInterface
{
    private Feed|null $feed = null;

    private array $stories = [];

    private string $link;

    public function __construct(string $link)
    {
        $this->link = $link;
    }

    public function getFeed(): Feed|null
    {
        return $this->feed;
    }

    /**
     * @return FeedStory[]
     */
    public function getStories(): array
    {
        return $this->stories;
    }

    public function parse(): void
    {
        $data = @file_get_contents($this->link);

        if (!$data) {
            return;
        }

        $doc = new \DOMDocument();
        $doc->loadXML($data);

        $this->processChannel($doc->getElementsByTagName('channel')->item(0));
    }

    protected function processChannel(\DOMNode $node): void
    {
        $this->feed = new Feed();

        /** @var \DOMNode $childNode */
        foreach ($node->childNodes as $childNode) {
            switch ($childNode->nodeName) {
                case 'title':
                    $this->feed->name = $childNode->textContent;
                    break;
                case 'description':
                    $this->feed->description = $childNode->textContent;
                    break;
                case 'link':
                    $this->feed->site = $childNode->textContent;
                    break;
                case 'image':
                    $this->feed->imageUrl = $this->processImage($childNode);
                    break;
                case 'item':
                    $this->processItem($childNode);
                    break;
            }
        }
    }

    protected function processItem(\DOMNode $node): void
    {
        $story = new FeedStory();

        /** @var \DOMNode $childNode */
        foreach ($node->childNodes as $childNode) {
            switch ($childNode->nodeName) {
                case 'guid':
                    $story->id = $childNode->textContent;
                    break;
                case 'title':
                    $story->title = $childNode->textContent;
                    break;
                case 'description':
                    $story->content = $childNode->textContent;
                    break;
                case 'link':
                    $story->link = $childNode->textContent;
                    break;
                case 'pubDate':
                    $story->pubDate = strtotime($childNode->textContent);
                    break;
            }
        }

        $this->stories[] = $story;
    }

    protected function processImage(\DOMNode $node): string|null
    {
        /** @var \DOMNode $childNode */
        foreach ($node->childNodes as $childNode) {
            switch ($childNode->nodeName) {
                case 'url':
                    return $childNode->textContent;
            }
        }

        return null;
    }
}
