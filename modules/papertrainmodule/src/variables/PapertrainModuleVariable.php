<?php
/**
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule\variables;

use modules\papertrainmodule\PapertrainModule;

use Craft;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class PapertrainModuleVariable
{
    // Public Methods
    // =========================================================================

    public function css($css)
    {
        return PapertrainModule::getInstance()->pwaService->injectCriticalCSS($css);
    }

    public function getCache(string $entryId)
    {
        return PapertrainModule::getInstance()->pwaService->getCache($entryId);
    }

    public function makeMD5Hash($string)
    {
        $hashed = md5($string);
        return $hashed;
    }

    public function checkRequireLogin($entry)
    {
        $requiresLogin = false;
        if (!empty($entry) && isset($entry['requireLogin']))
        {
            $requiresLogin = PapertrainModule::getInstance()->pwaService->checkRequireLogin($entry);
        }
        return $requiresLogin;
    }
}
