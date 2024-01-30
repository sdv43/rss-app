<?php
namespace Sdv43\RssApp\Routes\Api;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpUnauthorizedException;
use function Sdv43\RssApp\jsonify;

class AuthHandler
{
    function signIn(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $input = $request->getParsedBody();
        $code = (string) ($input['code'] ?? '');

        $stmt = $storage->prepare("select id from accounts where code = ? limit 1");
        $stmt->execute([$code]);

        $account = $stmt->fetch();

        if ($account) {
            $stmt = $storage->prepare("update accounts set last_sign_in = now() where id = ? limit 1");
            $stmt->execute([$account['id']]);

            $_SESSION['account_id'] = $account['id'];

            return jsonify($response);
        } else {
            throw new HttpUnauthorizedException($request, 'Incorrect code');
        }
    }

    function signUp(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $code = password_hash(microtime(true), PASSWORD_DEFAULT);

        $stmt = $storage->prepare("insert into accounts (code) values (?)");
        $stmt->execute([$code]);

        return jsonify($response, ['code' => $code]);
    }

    function updateCode(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');
        $code = password_hash(microtime(true), PASSWORD_DEFAULT);

        $stmt = $storage->prepare("update accounts set code = ? where id = ? limit 1");
        $stmt->execute([$code, $accountId]);

        return jsonify($response, ['code' => $code]);
    }

    function signOut(Request $request, Response $response): Response
    {
        session_destroy();

        return jsonify($response);
    }
}
