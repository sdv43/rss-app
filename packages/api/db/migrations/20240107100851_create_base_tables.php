<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateBaseTables extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change(): void
    {
        $this
            ->table('accounts')
            ->addColumn('code', 'string', ['null' => false])
            ->addColumn('last_sign_in', 'timestamp')
            ->addColumn('notifications_period', 'string')
            ->addColumn('theme', 'enum', ['default' => 'auto', 'values' => 'light,dark,auto'])
            ->addIndex('code', ['unique' => true])
            ->create();

        $this
            ->table('feeds')
            ->addColumn('account_id', 'integer', ['null' => false])
            ->addColumn('name', 'string', ['null' => false])
            ->addColumn('link', 'string', ['null' => false])
            ->addColumn('last_update', 'timestamp')
            ->addColumn('ttl', 'integer', ['null' => false, 'default' => 3600])
            ->addIndex(['account_id', 'link'], ['unique' => true])
            ->create();

        $this
            ->table('stories_saved')
            ->addColumn('feed_id', 'integer', ['null' => false])
            ->addColumn('title', 'string', ['null' => false])
            ->addColumn('link', 'string', ['null' => false])
            ->addColumn('content', 'text', ['null' => false])
            ->addIndex(['feed_id', 'link'], ['unique' => true])
            ->create();
    }
}
