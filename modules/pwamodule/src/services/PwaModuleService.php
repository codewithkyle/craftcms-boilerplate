<?php
/**
 * pwa module for Craft CMS 3.x
 *
 * Utilities for building a Craft CMS PWA
 *
 * @link      https://jintmethod.dev/
 * @copyright Copyright (c) 2019 Kyle Andrews
 */

namespace modules\pwamodule\services;

use modules\pwamodule\PwaModule;

use Craft;
use craft\base\Component;
use craft\helpers\FileHelper;

/**
 * @author    Kyle Andrews
 * @package   PwaModule
 * @since     1.0.0
 */
class PwaModuleService extends Component
{
    // Public Methods
    // =========================================================================

    /*
     * @return mixed
     */
    public function cachebust()
    {
        if ($settings = include(FileHelper::normalizePath(Craft::$app->getPath()->getConfigPath() . '/pwa.php')))
        {
            if (is_array($settings))
            {
                $response = [
                    'success' => true,
                    'resourcesCache' => $settings['resourcesCache'],
                    'pagesCache' => $settings['pagesCache'],
                    'pagesCacheDuration' => $settings['pagesCacheDuration'], 
                ];
            }
            else
            {
                $response = [
                    'success' => false,
                    'error' => 'pwa.php does not return an array'
                ];
            }
        }
        else
        {
            $response = [
                'success' => false,
                'error' => 'Failed to find pwa.php file in the config/ directory'
            ];
        }
        
        return $response;
    }
}
