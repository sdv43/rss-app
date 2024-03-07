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

        $stmt = $storage->prepare('select password, theme, subscription from accounts where id = ? limit 1');
        $stmt->execute([$accountId]);

        $account = $stmt->fetch(\PDO::FETCH_ASSOC);

        $stmt = $storage->prepare('select * from notifications where account_id = ?');
        $stmt->execute([$accountId]);

        $account['notifications'] = [];
        $notifications = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($notifications as $notification) {
            $day = str_pad($notification['day'], 2, '0', STR_PAD_LEFT);
            $hour = str_pad($notification['hour'], 2, '0', STR_PAD_LEFT);
            $minute = str_pad($notification['minute'], 2, '0', STR_PAD_LEFT);

            $account['notifications'][] = $day . '-' . $hour . ':' . $minute;
        }

        $account['notifications'] = implode(';', $account['notifications']);

        return jsonify($response, $account);
    }

    function update(Request $request, Response $response): Response
    {
        $input = $request->getParsedBody();
        $storage = Storage::getInstance();
        $accountId = intval($_SESSION['account_id']);

        $theme = $this->parseTheme((string) ($input['theme'] ?? ''));

        if (!$theme) {
            throw new HttpBadRequestException($request, 'Theme is incorrect');
        }

        $notifications = $this->parsePeriod((string) ($input['notifications'] ?? ''));

        if (!$notifications) {
            throw new HttpBadRequestException($request, 'Notfications period is incorrect');
        }

        $stmt = $storage->prepare("update accounts set theme = ? where id = ? limit 1");
        $stmt->execute([$theme, $accountId]);

        $stmt = $storage->prepare("delete from notifications where account_id = ?");
        $stmt->execute([$accountId]);

        foreach ($notifications as $notification) {
            $stmt = $storage->prepare('insert into notifications (account_id, day, hour, minute) values (?, ?, ?, ?)');
            $stmt->execute([$accountId, $notification['day'], $notification['hour'], $notification['minute']]);
        }

        return jsonify($response);
    }

    private function parsePeriod(string $period): array|false
    {
        if (empty($period)) {
            return [];
        }

        $isMatch = preg_match('/[0-9]{2}-[0-9]{2}:[0-9]{2}(;[0-9]{2}-[0-9]{2}:[0-9]{2})*/', $period) === 1;

        if ($isMatch) {
            $result = [];
            $notifications = explode(';', $period);

            foreach ($notifications as $notification) {
                list($day, $hourminute) = explode('-', $notification);
                list($hour, $minute) = explode(':', $hourminute);

                $result[] = [
                    'day' => intval($day),
                    'hour' => intval($hour),
                    'minute' => intval($minute),
                ];
            }

            return $result;
        }

        return false;
    }

    private function parseTheme(string $theme): string|false
    {
        return in_array($theme, ['auto', 'dark', 'light']) ? $theme : false;
    }
}
