<?php

declare(strict_types=1);


namespace Api\Methods;


use Rss\Reader;
use Storage\Channel;
use Storage\User;

class ChannelCreate implements Method
{
    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);

        $rssReader = new Reader();
        $channel = $rssReader->read($params["rss_url"]);

        return Channel::create(
            [
                "user_id" => $user["id"],
                "name" => $params["name"],
                "logo_url" => $channel->image?->url,
                "rss_url" => $params["rss_url"],
            ]
        );
    }
}