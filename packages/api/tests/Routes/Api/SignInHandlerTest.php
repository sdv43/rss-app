<?php

namespace Routes\Api;

use PHPUnit\Framework\TestCase;
use Sdv43\RssApp\Routes\Api\AuthHandler;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Headers;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Slim\Psr7\Stream;
use Slim\Psr7\Uri;

class SignInHandlerTest extends TestCase
{

    public function test__invoke()
    {
        $handler = new AuthHandler();

        $response = $handler(
            new Request(
                'GET',
                new Uri('https', 'testapp.ru'),
                new Headers(),
                [],
                [],
                (new StreamFactory)->createStream()
            ),
            new Response(),
            []
        );

        var_dump(
            (string) $response->getBody()
        );
    }
}
