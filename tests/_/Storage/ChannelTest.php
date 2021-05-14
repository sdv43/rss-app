<?php

declare(strict_types=1);


namespace _\Storage;


use Storage\Channel;
use Storage\Connection;

class ChannelTest extends \PHPUnit\Framework\TestCase
{
    public static function setUpBeforeClass(): void
    {
        $c = Connection::getInstance();

        $c->exec(
            <<<SQL
            delete from channels;
            SQL
        );

        $c->exec(
            <<<SQL
            insert into channels 
                (user_id, name, logo_url, rss_url) 
            values 
                (1, 'ch-1', 'http://test.ru/ch-1.png', 'http://rss.ru/rss-1'),
                (1, 'ch-2', 'http://test.ru/ch-2.png', 'http://rss.ru/rss-2')
            SQL
        );
    }

    public static function testGetByUserId(): void
    {
        $channels = Channel::getByUserId(1);
        self::assertCount(2, $channels, "The method must return 2 channels");

        $channels = Channel::getByUserId(2);
        self::assertCount(0, $channels, "The method must return 0 channels");
    }

    public static function testCreate(): void
    {
        $channel = [
            "user_id" => 1,
            "name" => "ch-3",
            "logo_url" => "http://test.ru/ch-3.png",
            "rss_url" => "http://rss.ru/rss-3",
        ];

        $createdChannel = Channel::create($channel);

        static::assertNotEmpty($createdChannel["id"], "ID is missing");

        $channel["id"] = $createdChannel["id"];

        static::assertEquals($channel, $createdChannel, "Created channel is different");
    }

    public static function testCreateWithoutLogo(): void
    {
        $channel = [
            "user_id" => 1,
            "name" => "ch-4",
            "logo_url" => null,
            "rss_url" => "http://rss.ru/rss-4",
        ];

        $createdChannel = Channel::create($channel);

        static::assertNotEmpty($createdChannel["id"], "ID is missing");

        $channel["id"] = $createdChannel["id"];

        static::assertEquals($channel, $createdChannel, "Created channel is different");
    }
}