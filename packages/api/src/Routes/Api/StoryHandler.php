<?php

namespace Sdv43\RssApp\Routes\Api;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\FeedParsers\FeedParserFactory;
use Sdv43\RssApp\FeedParsers\FeedStory;
use Sdv43\RssApp\Services\Storage;
use function Sdv43\RssApp\jsonify;

class StoryHandler
{
    function __invoke(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('select * from feeds where account_id = ?');
        $stmt->execute([$accountId]);

        $feedParserFactory = new FeedParserFactory();
        $feeds = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        /**
         * @var FeedStory[] $stories
         */
        $stories = [];

        foreach ($feeds as $feed) {
            $parser = $feedParserFactory->createParser('rss', $feed['link']);
            $parser->parse();

            $stories = array_merge($stories, array_map(function (FeedStory $v) use ($feed) {
                return [
                    'id' => $v->id,
                    'feed_id' => $feed['id'],
                    'title' => $v->title,
                    'content' => $v->content,
                    'link' => $v->link,
                    'pub_date' => $v->pubDate,
                ];
            }, $parser->getStories()));
        }

        return jsonify($response, $stories);
    }
}
