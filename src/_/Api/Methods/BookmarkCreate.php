<?php

declare(strict_types=1);


namespace Api\Methods;


use Storage\Bookmark;
use Storage\User;

class BookmarkCreate implements Method
{
    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);

        return Bookmark::create(
            [
                "id" => $params["id"],
                "user_id" => intval($user["id"]),
                "title" => $params["title"],
                "link" => $params["link"],
                "description" => $params["description"],
                "author" => $params["author"],
                "pubDate" => intval($params["pubDate"]),
                "category" => $params["category"],
                "channel_id" => $params["channel_id"],
                "photo" => $params["photo"],
            ]
        );
    }
}