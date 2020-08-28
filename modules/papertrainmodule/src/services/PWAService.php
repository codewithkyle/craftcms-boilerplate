<?php
/** 
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core  
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule\services;

use modules\papertrainmodule\PapertrainModule;

use Craft;
use craft\base\Component;
use craft\helpers\FileHelper;
use yii\redis\Cache;
use yii\redis\Connection;
use craft\helpers\StringHelper;
use GuzzleHttp\Client;
use craft\mail\Message;
use craft\helpers\UrlHelper;
use craft\elements\Entry;
/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class PWAService extends Component
{
    // Public Methods
    // =========================================================================

    public function cachebust()
    {
        $settings = include(FileHelper::normalizePath(Craft::$app->getPath()->getConfigPath() . '/pwa.php'));
        $cache = include(FileHelper::normalizePath(Craft::$app->getPath()->getRuntimePath() . '/pwa/cache.php'));
        if ($settings)
        {
            $response = [
                'success' => true,
                'contentCacheDuration' => $settings['contentCacheDuration'],
                'maximumContentPrompts' => $settings['maximumContentPrompts']
            ];

            // Sets content cache timestamp based on automated cache busting when possible
            if ($cache)
            {
                $response['cacheTimestamp'] = $cache['contentCache'];
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

    public function setupContentCache()
    {
        $dirPath = FileHelper::normalizePath(Craft::$app->getPath()->getRuntimePath() . '/pwa');
        if (!is_dir($dirPath))
        {
            mkdir($dirPath);
        }

        if (!file_exists($dirPath . '/cache.php'))
        {
            $file = fopen($dirPath . '/cache.php', "w");
            fwrite($file,"<?php\nreturn [\n\t'contentCache' => '" . time() . "',\n];");
            fclose($file);
        }
    }

    public function checkRequireLogin(Entry $entry)
    {
        $requiresLogin = false;
        $currEntry = $entry;
        do
        {
            if ($currEntry->requireLogin){
                $requiresLogin = true;
                break;
            }
            $currEntry = $currEntry->getParent();
        } while ($currEntry !== null || $requiresLogin);
        return $requiresLogin;
    }

    public function getCache(string $entryId) : string
    {
        $ret = '0';
        $cache = new Cache();
        $cache->redis->init();
        if ($cache->exists($entryId))
        {
            $ret = $cache->get($entryId);
        }
        else
        {
            $cache->set($entryId, '0');
        }
        return $ret;
    }
}
