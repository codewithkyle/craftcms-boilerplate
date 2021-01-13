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
class DefaultController extends Controller
{
    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = ["cachebust", "form-submit", "get-csrf"];

    // Public Methods
    // =========================================================================

    public function actionRenderBlock(string $id, string $handle)
    {
        return PapertrainModule::getInstance()->papertrainService->renderBlock($id, $handle);
    }

    public function actionGetBlock(string $id)
    {
        $data = PapertrainModule::getInstance()->papertrainService->getBlockData($id);
        return $this->asJson($data);
    }

    public function actionLoadCoreScript(string $script)
    {
        $filePath = dirname(__DIR__);
        $filePath .= "/assets/js/";
        $filePath .= $script;
        if (file_exists($filePath)) {
            return Craft::$app->response->sendFile($filePath, $script);
        } else {
            return Craft::$app->getResponse()->setStatusCode(404);
        }
    }

    public function actionLoadConfig()
    {
        $this->requireAcceptsJson();
        $config = PapertrainModule::getInstance()->papertrainService->getConfig();
        return $this->asJson($config);
    }

    public function actionCachebust()
    {
        $response = PapertrainModule::getInstance()->pwaService->cachebust();
        return json_encode($response);
    }

    public function actionGetCsrf()
    {
        $this->requireAcceptsJson();
        $response = [
            "success" => true,
            "csrf" => Craft::$app->request->getCsrfToken(),
        ];
        return json_encode($response);
    }
}
