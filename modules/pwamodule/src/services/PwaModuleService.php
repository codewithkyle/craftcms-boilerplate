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
use yii\redis\Cache;
use yii\redis\Connection;

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
                    'contentCache' => $settings['contentCache'],
                    'contentCacheDuration' => $settings['contentCacheDuration'],
                    'maximumContentPrompts' => $settings['maximumContentPrompts']
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

    public function updateRevisions(Array $entries)
    {
        $cache = new Cache();
        $cache->redis->init();

        foreach ($entries as $id)
        {
            if ($cache->exists($id))
            {
                $value = $cache->get($id);
                $value = $value + 1;
                $cache->set($id, $value);
            }
            else
            {
                $cache->set($id, '0');
                return '0';
            }
        }
    }
}
