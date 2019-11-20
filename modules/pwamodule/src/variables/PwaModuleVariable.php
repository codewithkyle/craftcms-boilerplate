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

use craft\db\Query;
use craft\db\Table;

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
        $lastRevisionNum = (new Query())
                            ->select(['num'])
                            ->from([Table::REVISIONS])
                            ->where(['sourceId' => $entryId])
                            ->orderBy(['num' => SORT_DESC])
                            ->limit(1)
                            ->scalar();
        return $lastRevisionNum;
    }
}
