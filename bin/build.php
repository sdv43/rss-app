#!/usr/bin/env php
<?php

try {
    $projectRoot = realpath(__DIR__ . '/../');

    echo "Project root: " . $projectRoot . "\n";
    echo "\n";

    # git
    echo "Pull changes...\n";
    kexec("git pull origin master");
    echo "Ok!\n";
    echo "\n";

    # composer
    $composerPath = $projectRoot . "/composer.json";

    if (file_exists($composerPath)) {
        echo "Composer...\n";

        $hash = null;
        $composerHashFile = sys_get_temp_dir() . "/composer.hash";

        if (file_exists($composerHashFile)) {
            $hash = file_get_contents($composerHashFile);
        }

        $hashNew = md5_file($composerPath);

        if ($hashNew === $hash) {
            echo "No changes\n";
        } else {
            kexec("composer install");
            file_put_contents($composerHashFile, $hashNew);
            echo "Ok!\n";
        }
    } else {
        echo "Skip composer\n";
    }

    echo "\n";

    # npm
    $npmPath = $projectRoot . "/package.json";

    if (file_exists($npmPath)) {
        echo "Npm...\n";

        $hash = null;
        $npmHashFile = sys_get_temp_dir() . "/package.hash";

        if (file_exists($npmHashFile)) {
            $hash = file_get_contents($npmHashFile);
        }

        $hashNew = md5_file($npmPath);

        if ($hashNew === $hash) {
            echo "No changes\n";
        } else {
            kexec("npm install");
            file_put_contents($npmHashFile, $hashNew);
            echo "Ok!\n";
        }
    } else {
        echo "Skip npm\n";
    }

    echo "\n";

    # build app
    echo "Build app...\n";
    kexec("npm run build");
    echo "Ok!\n";

    echo "\nBuild is finished!\n";
} catch (\RuntimeException $exception) {
    echo "\nError: {$exception->getMessage()}\n";
    exit(1);
} finally {
    echo "\n";
}

function kexec($command, &$output = null, &$result_code = null): string
{
    $r = exec("{$command} > /dev/null 2>&1", $output, $result_code);

    if ($result_code !== 0) {
        throw new \RuntimeException("Command executing error: {$command}, error code: {$result_code}", $result_code);
    }

    return $r;
}