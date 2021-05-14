<?php

declare(strict_types=1);

require_once __DIR__ . "/../vendor/autoload.php";

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . "/../", [".env.local", ".env"]);
$dotenv->load();

$response = [];

try {
    $dispatcher = new \Api\Dispatcher();

    $response = $dispatcher->process(
        (string)$_REQUEST['method'],
        (array)$_REQUEST['params']
    );
} catch (Exception $exception) {
    http_response_code(500);
    $response = [
        "error" => $exception->getMessage(),
    ];
} finally {
    header('Content-Type: application/json');
    print json_encode($response, JSON_UNESCAPED_UNICODE);
}