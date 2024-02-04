<?php

use Sdv43\RssApp\Middleware\CheckAccountMiddleware;
use Sdv43\RssApp\Routes\Api\BookmarkHandler;
use Sdv43\RssApp\Routes\Api\FeedHandler;
use Sdv43\RssApp\Routes\Api\SettingsHandler;
use Sdv43\RssApp\Routes\Api\AuthHandler;
use Sdv43\RssApp\Routes\Api\StoryHandler;
use Sdv43\RssApp\Routes\WebPush;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable([__DIR__ . '/../', __DIR__ . '/../../']);
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']);

$isProduction = $_ENV['ENV'] === 'production';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$app->group('/api', function (RouteCollectorProxy $group) use ($app) {
    $group->get('/code', [AuthHandler::class, 'signUp']);
    $group->post('/sign-in', [AuthHandler::class, 'signIn']);
    $group->get('/sign-out', [AuthHandler::class, 'signOut']);

    $group->group('', function () use ($group) {
        $group->post('/push-subscription', [WebPush::class, 'create']);
        $group->put('/push-subscription', [WebPush::class, 'update']);
        $group->delete('/push-subscription', [WebPush::class, 'delete']);
        $group->post('/code', [AuthHandler::class, 'updateCode']);
        $group->get('/settings', [SettingsHandler::class, 'get']);
        $group->put('/settings', [SettingsHandler::class, 'update']);
        $group->get('/feed', [FeedHandler::class, 'get']);
        $group->get('/feed/check', [FeedHandler::class, 'check']);
        $group->post('/feed', [FeedHandler::class, 'create']);
        $group->put('/feed/{id:[0-9]+}', [FeedHandler::class, 'update']);
        $group->delete('/feed/{id:[0-9]+}', [FeedHandler::class, 'delete']);
        $group->get('/story', StoryHandler::class);
        $group->get('/bookmark', [BookmarkHandler::class, 'get']);
        $group->post('/bookmark', [BookmarkHandler::class, 'create']);
        $group->delete('/bookmark/{id:[0-9]+}', [BookmarkHandler::class, 'delete']);

    })->add(new CheckAccountMiddleware);
});

$app->addErrorMiddleware(!$isProduction, true, true);

session_start([
    'cookie_lifetime' => 60 * 60 * 24 * 7 * 2,
]);

$app->run();
