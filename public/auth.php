<?php

declare(strict_types=1);

require_once __DIR__ . "/../vendor/autoload.php";

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . "/../", [".env.local", ".env"]);
$dotenv->load();

try {
    session_start();

    if ($_ENV["MODE"] === "production") {
        $hybridauth = new Hybridauth\Hybridauth(
            [
                "callback" => $_ENV["AUTH_CALLBACK"],
                "providers" => [
                    "Google" => [
                        "enabled" => true,
                        "keys" => [
                            "id" => $_ENV["GOOGLE_APP_ID"],
                            "secret" => $_ENV["GOOGLE_APP_SECRET"],
                        ],
                    ],
                    "GitHub" => [
                        "enabled" => true,
                        "keys" => [
                            "id" => $_ENV["GITHUB_APP_ID"],
                            "secret" => $_ENV["GITHUB_APP_SECRET"],
                        ],
                    ],
                ],
            ]
        );

        # check social type
        if (isset($_REQUEST["social"]) && in_array((string)$_REQUEST["social"], $hybridauth->getProviders())) {
            $_SESSION["social"] = (string)$_REQUEST["social"];
        }

        if (!isset($_SESSION["social"])) {
            throw new RuntimeException("No social set");
        }

        # authenticate
        $adapter = $hybridauth->authenticate($_SESSION["social"]);

        if (!$adapter->isConnected()) {
            throw new RuntimeException("Authentication error");
        }


        # create or update user
        $userProfile = $adapter->getUserProfile();
        $token = hash(
            "tiger128,3",
            implode(".", [$_SESSION["social"], $userProfile->identifier, $adapter->getAccessToken()])
        );

        $user = \Storage\User::authenticate(
            [
                "provider" => $_SESSION["social"],
                "identifier" => $userProfile->identifier,
                "photoUrl" => $userProfile->photoURL,
                "name" => $userProfile->displayName,
                "token" => $token,
            ]
        );

        # logout
        unset($_SESSION["social"]);
        $adapter->disconnect();
        session_destroy();
    } else {
        $token = "dev.hash.token.1";
    }

    # redirect
    header("Location: /stories/Latest?token={$token}");
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage();
}