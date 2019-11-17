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
    public function revision($entryId)
    {
        $table = Craft::$app->config->general->prefix . '_revisions';
        $result = (new \yii\db\Query())
                ->select(['num'])
                ->from($table)
                ->where(['sourceId' => $entryId])
                ->orderBy('num desc')
                ->one();
        return $result['num'];
    }
}
