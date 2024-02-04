<?php

namespace Sdv43\RssApp\Routes;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpBadRequestException;
use function Sdv43\RssApp\jsonify;

class WebPush
{
    public function create(Request $request, Response $response): Response
    {
        $input = $request->getParsedBody();
        $storage = Storage::getInstance();
        $accountId = intval($_SESSION['account_id']);

        $newSubscription = $input['subscription'] ?? null;

        $stmt = $storage->prepare('select subscription from accounts where id = ? limit 1');
        $stmt->execute([$accountId]);

        $subscription = $stmt->fetchColumn();

        if (!is_null($subscription)) {
            throw new HttpBadRequestException($request, 'Subscription already exists');
        }

        $stmt = $storage->prepare('update accounts set subscription = ? where id = ? limit 1');
        $stmt->execute([$newSubscription, $accountId]);

        return jsonify($response);
    }

    public function delete(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = intval($_SESSION['account_id']);

        $stmt = $storage->prepare('update accounts set subscription = null where id = ? limit 1');
        $stmt->execute([$accountId]);

        return jsonify($response);
    }
}