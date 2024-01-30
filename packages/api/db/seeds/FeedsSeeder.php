<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class FeedsSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * https://book.cakephp.org/phinx/0/en/seeding.html
     */
    public function run(): void
    {
        $this
            ->table('feeds')
            ->insert([
                [
                    'account_id' => 1,
                    'name' => 'FrontendFocus',
                    'link' => 'https://cprss.s3.amazonaws.com/frontendfoc.us.xml',
                ],
                [
                    'account_id' => 1,
                    'name' => 'TypeScript',
                    'link' => 'https://devblogs.microsoft.com/typescript/feed/',
                ],
                [
                    'account_id' => 1,
                    'name' => 'Chromium Blog',
                    'link' => 'https://blog.chromium.org/feeds/posts/default?alt=rss',
                ],
            ])
            ->save();
    }

    public function getDependencies(): array
    {
        return ['AccountsSeeder'];
    }
}
