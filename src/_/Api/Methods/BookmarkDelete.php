<?php

declare(strict_types=1);


namespace Api\Methods;


use Storage\Bookmark;
use Storage\User;

class BookmarkDelete implements Method
{

    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);

        Bookmark::delete($params["id"], intval($user["id"]));

        return [true];
    }
}