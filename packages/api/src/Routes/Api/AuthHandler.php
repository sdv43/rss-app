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
        $email = (string) ($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        $stmt = $storage->prepare("select id, password from accounts where email = ? limit 1");
        $stmt->execute([$email]);

        $account = $stmt->fetch();

        if ($account && password_verify($password, $account['password'])) {
            $stmt = $storage->prepare("update accounts set last_sign_in = now() where id = ? limit 1");
            $stmt->execute([$account['id']]);

            $_SESSION['account_id'] = $account['id'];

            return jsonify($response);
        } else {
            throw new HttpUnauthorizedException($request, 'Incorrect email or password');
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
