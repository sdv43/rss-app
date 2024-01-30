<?php
namespace Sdv43\RssApp\Routes\Api;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Sdv43\RssApp\Services\Storage;
use Slim\Exception\HttpBadRequestException;
use function Sdv43\RssApp\jsonify;

class SettingsHandler
{
    function get(Request $request, Response $response): Response
    {
        $storage = Storage::getInstance();
        $accountId = $request->getAttribute('accountId');

        $stmt = $storage->prepare('select code, notifications_period, theme from accounts where id = ? limit 1');
        $stmt->execute([$accountId]);

        $account = $stmt->fetch(\PDO::FETCH_ASSOC);

        return jsonify($response, $account);
    }

    function update(Request $request, Response $response): Response
    {
        $input = $request->getParsedBody();
        $storage = Storage::getInstance();
        $accountId = intval($_SESSION['account_id']);

        $notificationsPeriod = $this->parsePeriod((string) ($input['notifications_period'] ?? ''));
        $theme = $this->parseTheme((string) ($input['theme'] ?? ''));

        if (!$notificationsPeriod) {
            throw new HttpBadRequestException($request, 'Notfications period is incorrect');
        }

        if (!$theme) {
            throw new HttpBadRequestException($request, 'Theme is incorrect');
        }

        $stmt = $storage->prepare("update accounts set notifications_period = ? , theme = ? where id = ? limit 1");
        $stmt->execute([$notificationsPeriod, $theme, $accountId]);

        return jsonify($response);
    }

    private function parsePeriod(string $period): string|false
    {
        return preg_match('/[0-9]{2}-[0-9]{2}:[0-9]{2}(;[0-9]{2}-[0-9]{2}:[0-9]{2})*/', $period) === 1
            ? $period
            : false;
    }

    private function parseTheme(string $theme): string|false
    {
        return in_array($theme, ['auto', 'dark', 'light']) ? $theme : false;
    }
}
