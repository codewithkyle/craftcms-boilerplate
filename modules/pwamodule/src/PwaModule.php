<?php
/**
 * pwa module for Craft CMS 3.x
 *
 * Utilities for building a Craft CMS PWA
 *
 * @link      https://jintmethod.dev/
 * @copyright Copyright (c) 2019 Kyle Andrews
 */

namespace modules\pwamodule;

use modules\pwamodule\assetbundles\pwamodule\PwaModuleAsset;
use modules\pwamodule\services\PwaModuleService as PwaModuleServiceService;
use modules\pwamodule\variables\PwaModuleVariable;

use Craft;
use craft\events\RegisterTemplateRootsEvent;
use craft\events\TemplateEvent;
use craft\i18n\PhpMessageSource;
use craft\web\View;
use craft\web\UrlManager;
use craft\web\twig\variables\CraftVariable;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\services\Fields;
use craft\events\RegisterCpNavItemsEvent;
use craft\web\twig\variables\Cp;
use craft\utilities\ClearCaches;
use craft\helpers\FileHelper;
use craft\events\RegisterCacheOptionsEvent;

use yii\base\Event;
use yii\base\InvalidConfigException;
use yii\base\Module;

use craft\services\Elements;
use craft\events\ElementEvent;
use craft\elements\Entry;
use craft\services\Revisions;

/**
 * Class PwaModule
 *
 * @author    Kyle Andrews
 * @package   PwaModule
 * @since     1.0.0
 *
 * @property  PwaModuleServiceService $pwaModuleService
 */
class PwaModule extends Module
{
    // Static Properties
    // =========================================================================

    /**
     * @var PwaModule
     */
    public static $instance;

    public $hasCpSettings = true;

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function __construct($id, $parent = null, array $config = [])
    {
        Craft::setAlias('@modules/pwamodule', $this->getBasePath());
        $this->controllerNamespace = 'modules\pwamodule\controllers';

        // Translation category
        $i18n = Craft::$app->getI18n();
        /** @noinspection UnSafeIsSetOverArrayInspection */
        if (!isset($i18n->translations[$id]) && !isset($i18n->translations[$id.'*'])) {
            $i18n->translations[$id] = [
                'class' => PhpMessageSource::class,
                'sourceLanguage' => 'en-US',
                'basePath' => '@modules/pwamodule/translations',
                'forceTranslation' => true,
                'allowOverrides' => true,
            ];
        }

        // Base template directory
        Event::on(View::class, View::EVENT_REGISTER_CP_TEMPLATE_ROOTS, function (RegisterTemplateRootsEvent $e) {
            if (is_dir($baseDir = $this->getBasePath().DIRECTORY_SEPARATOR.'templates')) {
                $e->roots[$this->id] = $baseDir;
            }
        });

        // Set this as the global instance of this module class
        static::setInstance($this);

        parent::__construct($id, $parent, $config);
    }

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        self::$instance = $this;

        // Register our site routes
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['/pwa/cachebust'] = 'pwa-module/default/cachebust';
            }
        );

        Craft::info(
            Craft::t(
                'pwa-module',
                '{name} module loaded',
                ['name' => 'pwa']
            ),
            __METHOD__
        );
    }

    // Protected Methods
    // =========================================================================
}
