<?php
/**
 * pwa module for Craft CMS 3.x
 *
 * Utilities for building a Craft CMS PWA
 *
 * @link      https://jintmethod.dev/
 * @copyright Copyright (c) 2019 Kyle Andrews
 */

namespace modules\pwamodule\variables;

use modules\pwamodule\PwaModule;
use yii\redis\Cache;
use yii\redis\Connection;

use Craft;

/**
 * @author    Kyle Andrews
 * @package   PwaModule
 * @since     1.0.0
 */
class PwaModuleVariable
{
    // Public Methods
    // =========================================================================

    /**
     * @param null $optional
     * @return string
     */
    public function getCache($entryId)
    {
        $cache = new Cache();
        $cache->redis->init();
        if ($cache->exists($entryId))
        {
            return $cache->get($entryId);
        }
        else
        {
            $cache->set($entryId, '0');
            return '0';
        }
    }
}
