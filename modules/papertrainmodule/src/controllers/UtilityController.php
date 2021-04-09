<?php
/**
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule\controllers;

use modules\papertrainmodule\PapertrainModule;

use Craft;
use craft\web\Controller;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class UtilityController extends Controller
{
	// Protected Properties
	// =========================================================================

	/**
	 * @var    bool|array Allows anonymous access to this controller's actions.
	 *         The actions must be in 'kebab-case'
	 * @access protected
	 */
	protected $allowAnonymous = ["get-csrf", "render-block"];

	// Public Methods
	// =========================================================================

	public function actionRenderBlock($ownerId, $blockId)
	{
		$html = PapertrainModule::getInstance()->viewService->renderBlock((int) $ownerId, (int) $blockId);
		return $html;
	}

	public function actionGetCsrf()
	{
		$this->requireAcceptsJson();
		$response = [
			"success" => true,
			"data" => Craft::$app->request->getCsrfToken(),
			"error" => null,
		];
		return $this->asJson($response);
	}
}
