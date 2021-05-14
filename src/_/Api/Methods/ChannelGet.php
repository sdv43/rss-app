<?php

declare(strict_types=1);


namespace Api\Methods;


use Storage\Channel;
use Storage\User;

class ChannelGet implements Method
{
    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);

        return Channel::getByUserId(intval($user["id"]));
    }
}