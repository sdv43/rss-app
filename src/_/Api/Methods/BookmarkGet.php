<?php

declare(strict_types=1);


namespace Api\Methods;


use Storage\Bookmark;
use Storage\User;

class BookmarkGet implements Method
{

    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);

        return array_map(
            function ($b) {
                $b["category"] = explode(",", $b["category"]);

                return $b;
            },
            Bookmark::getByUserId(intval($user["id"]))
        );
    }
}