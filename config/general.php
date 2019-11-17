<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

$customConfig = [
    // Global settings
    '*' => [
        'defaultWeekStartDay' => 1,
        'omitScriptNameInUrls' => true,
        'cpTrigger' => 'webmaster',
        'securityKey' => getenv('SECURITY_KEY'),
        'useProjectConfigFile' => true,
    ],

    // Dev environment settings
    'dev' => [
        // Base site URL
        'siteUrl'               => getenv('DEV_URL'),
        'allowUpdates'          => true,
        'devMode'               => true,
        'enableTemplateCaching' => false,
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

// If a local config file exists, merge any local config settings
if (is_array($customLocalConfig = include('cachebust.php'))) {
    $customGlobalConfig = array_merge($customConfig['*'], $customLocalConfig);
    $customConfig['*'] = $customGlobalConfig;
}

return $customConfig;