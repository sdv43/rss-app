<?php

namespace Sdv43\RssApp\Middleware;

use Fig\Http\Message\StatusCodeInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Response;

class CheckAccountMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $storage = Storage::getInstance();
        $accountId = intval($_SESSION['account_id'] ?? 0);

        $stmt = $storage->prepare('select id from accounts where id = ? limit 1');
        $stmt->execute([$accountId]);

        $isExists = $stmt->fetch();

        if ($isExists) {
            $response = $handler->handle($request->withAttribute('accountId', $accountId));
        } else {
            throw new HttpUnauthorizedException($request);
        }

        return $response;
    }
}
