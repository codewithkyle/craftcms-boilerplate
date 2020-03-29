<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

return [
    // Global settings
    '*' => [
        'defaultWeekStartDay'               => 1,
        'omitScriptNameInUrls'              => true,
        'cpTrigger'                         => 'webmaster',
        'securityKey'                       => getenv('SECURITY_KEY'),
        'useProjectConfigFile'              => true,
        'useEmailAsUsername'                => true,
        'setPasswordPath'                   => 'users/set-password',
        'autoLoginAfterAccountActivation'   => true,
        'email'                             => getenv('SYSTEM_EMAIL'),
    ],

    // Dev environment settings
    'dev' => [
        // Base site URL
        'siteUrl'               => getenv('DEV_URL'),
        'devMode'               => true,
        'allowUpdates'          => true,
        'enableTemplateCaching' => false,
        'testToEmailAddress'    => getenv('DEV_EMAIL_ADDRESS'),
        'aliases' => [
            '@rootUrl' => getenv('DEV_URL'),
        ],
    ],

    // Staging environment settings
    'staging' => [
        // Base site URL
        'siteUrl'           => getenv('STAGING_URL'),
        'allowAdminChanges' => false,
        'aliases' => [
            '@rootUrl' => getenv('STAGING_URL'),
        ],
    ],

    // Production environment settings
    'production' => [
        // Base site URL
        'siteUrl'           => getenv('PRODUCTION_URL'),
        'allowAdminChanges' => false,
        'aliases' => [
            '@rootUrl' => getenv('PRODUCTION_URL'),
        ],
    ],
];