<?php

namespace Sdv43\RssApp\Routes\Api;

use Fig\Http\Message\StatusCodeInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\FeedParsers\FeedParserFactory;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpBadRequestException;
use function Sdv43\RssApp\jsonify;

class FeedHandler
{
    function get(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('select id, name, icon_link, link, ttl from feeds where account_id = ?');
        $stmt->execute([$accountId]);

        return jsonify($response, $stmt->fetchAll(\PDO::FETCH_ASSOC));
    }

    function check(Request $request, Response $response): Response
    {
        $link = $_GET['link'];

        $feedParserFactory = new FeedParserFactory();
        $parser = $feedParserFactory->createParser('rss', $link);
        $parser->parse();

        $feed = $parser->getFeed();

        if (is_null($feed)) {
            return jsonify($response, new \RuntimeException('Cannot parse the feed info'));
        }

        if (is_null($feed->name)) {
            return jsonify($response, new \RuntimeException('The feed does not have a name'));
        }

        return jsonify($response, [
            'name' => $feed->name,
            'icon_link' => $feed->imageUrl,
            'stories_count' => count($parser->getStories()),
        ]);
    }

    function create(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');
        $input = $request->getParsedBody();

        $feedName = substr(trim((string) ($input['name'] ?? '')), 0, 64);
        $feedIconLink = substr(trim((string) ($input['icon_link'] ?? '')), 0, 255);
        $feedLink = trim((string) ($input['link'] ?? ''));

        if (!$feedName || !$feedLink) {
            throw new HttpBadRequestException($request, 'Wrong parameters');
        }

        $stmt = $storage->prepare('insert into feeds (account_id, name, icon_link, link) values (?, ?, ?, ?)');
        $stmt->execute([
            $accountId,
            $feedName,
            $feedIconLink,
            $feedLink,
        ]);

        return jsonify($response, ['id' => $storage->lastInsertId()]);
    }

    function update(Request $request, Response $response, $args): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');
        $input = $request->getParsedBody();

        $feedName = substr(trim((string) ($input['name'] ?? '')), 0, 64);
        $feedIconLink = substr(trim((string) ($input['icon_link'] ?? '')), 0, 255);
        $feedLink = trim((string) ($input['link'] ?? ''));

        if (!$feedName || !$feedLink) {
            throw new HttpBadRequestException($request, 'Wrong parameters');
        }

        $stmt = $storage->prepare('update feeds set name = ?, icon_link = ?, link = ? where id = ? and account_id = ? limit 1');
        $stmt->execute([
            $feedName,
            $feedIconLink,
            $feedLink,
            intval($args['id']),
            $accountId
        ]);

        return jsonify($response);
    }

    function delete(Request $request, Response $response, array $args): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('delete from feeds where id = ? and account_id = ? limit 1');
        $stmt->execute([$args['id'], $accountId]);

        return jsonify($response);
    }
}
