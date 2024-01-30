<?php
namespace Sdv43\RssApp\Routes\Api;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpBadRequestException;
use function Sdv43\RssApp\jsonify;

class BookmarkHandler
{
    function get(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('select id, story_id, feed_id, title, link, content, unix_timestamp(pub_date) as pub_date from stories_saved where account_id = ? order by id DESC');
        $stmt->execute([$accountId]);

        return jsonify($response, array_map(function ($story) {
            $story['real_id'] = $story['id'];
            $story['id'] = $story['story_id'];
            unset($story['story_id']);

            return $story;
        }, $stmt->fetchAll(\PDO::FETCH_ASSOC)));
    }

    function create(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');
        $input = $request->getParsedBody();

        $storyId = trim((string) ($input['id'] ?? ''));
        $storyTitle = trim((string) ($input['title'] ?? ''));
        $storyLink = trim((string) ($input['link'] ?? ''));
        $storyContent = trim((string) ($input['content'] ?? ''));
        $storyPubDate = intval($input['pub_date'] ?? 0);
        $storyFeedId = intval($input['feed_id'] ?? 0);

        if (!$storyTitle || !$storyLink || !$storyContent || !$storyPubDate || !$storyFeedId) {
            throw new HttpBadRequestException($request, 'Wrong parameters');
        }

        $stmt = $storage->prepare('insert into stories_saved (story_id, account_id, feed_id, title, link, content, pub_date) values (?, ?, ?, ?, ?, ?, from_unixtime(?))');
        $stmt->execute([
            $storyId,
            $accountId,
            $storyFeedId,
            $storyTitle,
            $storyLink,
            $storyContent,
            $storyPubDate,
        ]);

        return jsonify($response, ['id' => $storage->lastInsertId()]);
    }

    function delete(Request $request, Response $response, $args): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('delete from stories_saved where id = ? and account_id = ? limit 1');
        $stmt->execute([$args['id'], $accountId]);

        return jsonify($response);
    }
}
