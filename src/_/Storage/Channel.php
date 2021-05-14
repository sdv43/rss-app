<?php

declare(strict_types=1);


namespace Storage;


class Channel
{
    public static function getByUserId(int $userId): array
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            select * from channels where user_id = :userId
            SQL
        );
        $query->execute([":userId" => $userId]);

        return $query->fetchAll();
    }

    public static function create(array $channel): array
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            insert into channels 
                (user_id, name, logo_url, rss_url)
            values
                (:user_id, :name, :logo_url, :rss_url)
            SQL
        );
        $query->execute(
            [
                ":user_id" => $channel["user_id"],
                ":name" => $channel["name"],
                ":logo_url" => $channel["logo_url"],
                ":rss_url" => $channel["rss_url"],
            ]
        );

        $channelId = $c->lastInsertId();

        $query = $c->prepare(
            <<<SQL
            select * from main.channels where id = :id limit 1
            SQL
        );
        $query->execute([":id" => $channelId]);

        return $query->fetch();
    }
}