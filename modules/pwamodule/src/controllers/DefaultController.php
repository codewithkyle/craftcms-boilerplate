<?php
/**
 * pwa module for Craft CMS 3.x
 *
 * Utilities for building a Craft CMS PWA
 *
 * @link      https://jintmethod.dev/
 * @copyright Copyright (c) 2019 Kyle Andrews
 */

namespace modules\pwamodule\controllers;

use modules\pwamodule\PwaModule;

use Craft;
use craft\web\Controller;
use craft\db\Query;
use craft\db\Table;
use craft\base\Model;

/**
 * @author    Kyle Andrews
 * @package   PwaModule
 * @since     1.0.0
 */
class DefaultController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ['cachebust'];

    // Public Methods
    // =========================================================================

    public function actionCachebust()
    {
        $response = PwaModule::getInstance()->pwaModuleService->cachebust();
        return json_encode($response);
    }
}
