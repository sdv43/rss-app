<?php

declare(strict_types=1);


namespace Storage;


class Bookmark
{
    public static function getByUserId(int $userId): array
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            select * from bookmarks where user_id = :userId
            SQL
        );
        $query->execute([":userId" => $userId]);

        return $query->fetchAll();
    }

    public static function create(array $bookmark): array
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            insert into bookmarks (id, user_id, title, link, description, author, pubDate, category, channel_id, photo) 
            values (:id, :user_id, :title, :link, :description, :author, :pubDate, :category, :channel_id, :photo)
            SQL
        );
        $query->execute(
            [
                ":id" => $bookmark["id"],
                ":user_id" => $bookmark["user_id"],
                ":title" => $bookmark["title"],
                ":link" => $bookmark["link"],
                ":description" => $bookmark["description"],
                ":author" => $bookmark["author"],
                ":pubDate" => $bookmark["pubDate"],
                ":category" => $bookmark["category"],
                ":channel_id" => $bookmark["channel_id"],
                ":photo" => $bookmark["photo"],
            ]
        );

        $query = $c->prepare(
            <<<SQL
            select * from bookmarks where id = :id limit 1
            SQL
        );
        $query->execute([":id" => $bookmark["id"]]);

        return $query->fetch();
    }

    public static function delete(string $id, int $userId): void
    {
        $c = Connection::getInstance();

        $query = $c->prepare(
            <<<SQL
            delete from bookmarks where id = :id and user_id = :userId
            SQL
        );
        $query->execute([":id" => $id, ":userId" => $userId]);
    }
}