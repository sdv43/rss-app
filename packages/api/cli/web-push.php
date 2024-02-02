<?php
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Sdv43\RssApp\Services\Storage;

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable([__DIR__ . '/../', __DIR__ . '/../../']);
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'KEYS_PATH']);

$isProduction = $_ENV['ENV'] === 'production';
$storage = Storage::getInstance();

// 
$now = new DateTime();
$now->setTimezone(new DateTimeZone('UTC'));

$minutes = intval($now->format('i'));

if ($minutes < 15)
    $minutes = 0;
elseif ($minutes < 30)
    $minutes = 15;
elseif ($minutes < 45)
    $minutes = 30;
else
    $minutes = 45;

$datetime = $now->format("Y-m-d H:$minutes:00");

$stmt = $storage->prepare("
    select 
        n.id,
        n.account_id,
        a.subscription,
        timestampdiff(
            minute,
            str_to_date(
                concat('" . $now->format('Y-m-') . "', n.day, ' ', n.hour, ':', n.minute), 
                '%Y-%m-%d %H:%i'
            ),
            ?
        ) as minute
    from notifications as n, accounts as a 
    where n.account_id = a.id and a.subscription is not null
    group by id
    having minute between 0 and 14
");
$stmt->execute([$datetime]);

$notifications = [];

foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
    $notifications[] = [
        'id' => $row['id'],
        'subscription' => Subscription::create(json_decode($row['subscription'], true)),
        'payload' => json_encode(['message' => 'Check the feeds in the app!'])
    ];
}

$webPush = new WebPush([
    'VAPID' => array(
        'subject' => 'https://rss-app.ru',
        'publicKey' => file_get_contents($_ENV['KEYS_PATH'] . '/public_key.txt'),
        'privateKey' => file_get_contents($_ENV['KEYS_PATH'] . '/private_key.txt'),
    ),
]);

foreach ($notifications as $notification) {
    $webPush->queueNotification(
        $notification['subscription'],
        $notification['payload']
    );
}

echo "Start at " . (new Datetime())->format(DateTime::W3C) . PHP_EOL;

foreach ($webPush->flush() as $report) {
    $endpoint = $report->getEndpoint();

    if ($report->isSuccess()) {
        echo $report->getReason() . ' ' . $report->getEndpoint() . PHP_EOL;
    } else {
        echo 'error: ' . $report->getReason() . ' ' . $report->getEndpoint() . PHP_EOL;
    }
}

echo PHP_EOL;