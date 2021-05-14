<?php

declare(strict_types=1);


namespace Api\Methods;


use Storage\User;

class UserGet implements Method
{

    public function do(array $params): array
    {
        return User::getByToken($params["token"]);
    }
}