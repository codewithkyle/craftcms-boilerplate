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
    protected $allowAnonymous = ['check-revision'];

    // Public Methods
    // =========================================================================

    /**
     * @return mixed
     */
    public function actionCheckRevision()
    {
        $request = Craft::$app->getRequest();
        $entryId = $request->getParam('id');
        $table = Craft::$app->config->general->prefix . '_revisions';
        $result = (new \yii\db\Query())
					->select(['num'])
					->from($table)
					->where(['sourceId' => $entryId])
					->orderBy('num desc')
					->one();
		$response = [
			'success' => true,
			'revision' => $result['num']
		];
        return json_encode($response);
    }
}
