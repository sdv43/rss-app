<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class AccountsSeeder extends AbstractSeed
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
            ->table('accounts')
            ->insert([
                ['code' => '123456']
            ])
            ->save();
    }
}
