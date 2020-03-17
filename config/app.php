<?php
/**
 * Yii Application Config
 *
 * Edit this file at your own risk!
 *
 * The array returned by this file will get merged with
 * vendor/craftcms/cms/src/config/app/main.php and [web|console].php, when
 * Craft's bootstrap script is defining the configuration for the entire
 * application.
 *
 * You can define custom modules and system components, and even override the
 * built-in system components.
 */
return [
    // 'components' => [
    //     'redis' => [
    //         'class' => yii\redis\Connection::class,
    //         'hostname' => 'localhost',
    //         'port' => 6379,
    //         'password' => getenv('REDIS_PASSWORD'),
    //     ],
    //     'cache' => [
    //         'class' => yii\redis\Cache::class,
    //         'defaultDuration' => 86400,
    //         'keyPrefix' => 'asuperuniquekey123',
    //     ],
    // ],
    'modules' => [
        'pwa-module' => [
            'class' => \modules\pwamodule\PwaModule::class,
            'components' => [
                'pwaModuleService' => [
                    'class' => 'modules\pwamodule\services\PwaModuleService',
                ],
            ],
        ],
    ],
    'bootstrap' => ['pwa-module'],
];
