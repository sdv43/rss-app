<?php

declare(strict_types=1);


namespace Api\Methods;


use Rss\Element\Category;
use Rss\Element\Item;
use Rss\Reader;
use Storage\Channel;
use Storage\User;

class StoryGet implements Method
{
    public function do(array $params): array
    {
        $user = User::getByToken($params["token"]);
        $channels = Channel::getByUserId(intval($user["id"]));

        $stories = [];
        $rssReader = new Reader();

        foreach ($channels as $channel) {
            $ch = $rssReader->read($channel["rss_url"]);

            $stories = array_merge(
                $stories,
                array_map(
                    function (Item $item) use ($channel) {
                        return [
                            "id" => hash("crc32", $item->title),
                            "title" => strip_tags($item->title),
                            "photo" => static::searchImage((string)$item->description),
                            "link" => $item->link,
                            "description" => strip_tags($item->description, ["a", "br", "img"]),
                            "author" => $item->author,
                            "pubDate" => $item->pubDate->getTimestamp(),
                            "category" => array_map(
                                function (Category $category) {
                                    return $category->value;
                                },
                                $item->category
                            ),
                            "channel" => $channel["id"],
                        ];
                    },
                    $ch->items
                )
            );
        }

        usort(
            $stories,
            function (array $a, array $b) {
                return $a["pubDate"] > $b["pubDate"]
                    ? -1
                    : ($a["pubDate"] < $b["pubDate"] ? 1 : 0);
            }
        );

        return $stories;
    }

    private static function searchImage(string $description): ?string
    {
        preg_match('/\<img[^>]+src="([^"]+)"[^>]*>/i', $description, $urls);

        return $urls[1] ?? null;
    }
}