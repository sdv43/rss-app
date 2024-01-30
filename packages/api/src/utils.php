<?php

namespace Sdv43\RssApp;

use Fig\Http\Message\StatusCodeInterface;
use JsonException;
use Psr\Http\Message\ResponseInterface;

/**
 * @throws JsonException
 */
function jsonify(ResponseInterface $response, \Exception|array|null $data = null): ResponseInterface
{
    $jsonResponse = $response->withHeader('Content-Type', 'application/json');

    if (is_array($data) || is_null($data)) {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $jsonResponse = $jsonResponse->withStatus(StatusCodeInterface::STATUS_INTERNAL_SERVER_ERROR);
            $jsonResponse->getBody()->write(
                json_encode(
                    ['message' => 'JSON encode error: ' . json_last_error_msg()],
                    JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
                )
            );
        }

        $jsonResponse->getBody()->write($json);
    } else {
        if ($jsonResponse->getStatusCode() < 400) {
            $jsonResponse = $jsonResponse->withStatus(StatusCodeInterface::STATUS_BAD_REQUEST);
        }

        $jsonResponse->getBody()->write(
            json_encode(
                ['message' => $data->getMessage()],
                JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
            )
        );
    }

    return $jsonResponse;
}
