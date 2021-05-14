<?php

declare(strict_types=1);


namespace Storage;


use Api\ApiException;

class User
{
    public static function authenticate(array $user): array
    {
        $c = Connection::getInstance();

        #
        $query = $c->prepare(
            <<<SQL
            select id 
            from users 
            where provider = :provider and identifier = :identifier 
            limit 1
            SQL
        );
        $query->execute([":provider" => $user["provider"], ":identifier" => $user["identifier"]]);

        $result = $query->fetch();

        if ($result) {
            $userId = $result["id"];

            $query = $c->prepare(
                <<<SQL
                update users 
                set 
                    provider = :provider, 
                    identifier = :identifier, 
                    photoUrl = :photoUrl, 
                    name = :name,
                    token = :token
                where id = :userId
                SQL
            );
            $query->execute(
                [
                    ":userId" => $userId,
                    ":provider" => $user["provider"],
                    ":identifier" => $user["identifier"],
                    ":photoUrl" => $user["photoUrl"],
                    ":name" => $user["name"],
                    ":token" => $user["token"],
                ]
            );
        } else {
            $query = $c->prepare(
                <<<SQL
                insert into users (provider, identifier, photoUrl, name, token) 
                values (:provider, :identifier, :photoUrl, :name, :token)
                SQL
            );
            $query->execute(
                [
                    ":provider" => $user["provider"],
                    ":identifier" => $user["identifier"],
                    ":photoUrl" => $user["photoUrl"],
                    ":name" => $user["name"],
                    ":token" => $user["token"],
                ]
            );

            $userId = $c->lastInsertId();
        }

        #
        $query = $c->prepare(
            <<<SQL
            select * from users where id = :userId
            SQL
        );
        $query->execute([":userId" => $userId]);

        return $query->fetch();
    }

    public static function getByToken(string $token): array
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            select * from users where token = :token
            SQL
        );
        $query->execute([":token" => $token]);

        $user = $query->fetch();

        if (!$user) {
            throw new ApiException("User doesn't exists");
        }

        return $user;
    }
}