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
                [
                    'email' => 'q.selivestrov@gmail.com',
                    'password' => '$2y$10$Q5XE3m5ZHdGFe7lo5eFJv.DAadgVta4la3BnWjOgeG82JsSlij4PS'
                ]
            ])
            ->save();
    }
}
