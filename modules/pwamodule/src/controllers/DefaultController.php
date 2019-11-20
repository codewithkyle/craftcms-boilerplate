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
    protected $allowAnonymous = ['check-revision', 'cachebust'];

    // Public Methods
    // =========================================================================

    /**
     * @return mixed
     */
    public function actionCheckRevision()
    {
        $request = Craft::$app->getRequest();
        $entryId = $request->getParam('id');
        $lastRevisionNum = (new Query())
                            ->select(['num'])
                            ->from([Table::REVISIONS])
                            ->where(['sourceId' => $entryId])
                            ->orderBy(['num' => SORT_DESC])
                            ->limit(1)
                            ->scalar();
		$response = [
			'success' => true,
			'revision' => $lastRevisionNum
		];
        return json_encode($response);
    }

    public function actionCachebust()
    {
        $settings = Craft::$app->globals->getSetByHandle('pwaSettings');
        $response = [
            'success' => true,
            'resourcesCache' => Craft::$app->config->general->resourcesCache,
            'pagesCache' => $settings->pwaOfflineCachebust,
            'pagesCacheDuration' => $settings->pwaCacheDuration, 
        ];
        return json_encode($response);
    }
}
