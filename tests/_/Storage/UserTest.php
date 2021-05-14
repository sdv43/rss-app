<?php

declare(strict_types=1);


namespace _\Storage;


use Api\ApiException;
use Storage\Connection;
use Storage\User;

class UserTest extends \PHPUnit\Framework\TestCase
{
    public static function setUpBeforeClass(): void
    {
        $c = Connection::getInstance();

        $c->exec(
            <<<SQL
            delete from users;
            SQL

        );
    }

    public static function testCreateUser(): int
    {
        $expected = [
            "provider" => "Google",
            "identifier" => "1",
            "photoUrl" => "https://foto.ru/user.jpg",
            "name" => "User Name 1",
            "token" => "token.hash.123",
        ];

        $user = User::authenticate($expected);
        static::assertIsArray($user, "Result of authentication method must be an array");

        $expected["id"] = $user["id"];
        static::assertEquals($expected, $user, "Saved user data is wrong");

        return intval($user["id"]);
    }

    /**
     * @depends testCreateUser
     */
    public static function testUpdateUser(int $userId): string
    {
        $expected = [
            "provider" => "Google",
            "identifier" => "1",
            "photoUrl" => "https://foto.ru/user-edited.jpg",
            "name" => "User Name Edited",
            "token" => "token.hash.edited.123",
        ];

        $user = User::authenticate($expected);

        static::assertIsArray($user, "Result of authentication method must be an array");
        static::assertEquals($userId, intval($user["id"]), "Updated user id is different");

        $expected["id"] = $user["id"];

        static::assertEquals($expected, $user, "User data isn't updated");

        return "token.hash.edited.123";
    }

    /**
     * @depends testUpdateUser
     */
    public function testGetByToken(string $token)
    {
        $user = User::getByToken($token);

        static::assertEquals($token, $user["token"], "Returned token is different");

        $this->expectException(ApiException::class);

        $user = User::getByToken($token . ".exception");
    }
}