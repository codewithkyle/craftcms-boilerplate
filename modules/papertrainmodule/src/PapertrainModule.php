<?php
/**
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule;

use modules\papertrainmodule\services\papertrainService as papertrainServiceService;
use modules\papertrainmodule\variables\PapertrainModuleVariable;

use Craft;
use craft\events\RegisterTemplateRootsEvent;
use craft\events\TemplateEvent;
use craft\i18n\PhpMessageSource;
use craft\web\View;
use craft\web\UrlManager;
use craft\web\twig\variables\CraftVariable;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterCpNavItemsEvent;
use craft\web\twig\variables\Cp;
use craft\utilities\ClearCaches;
use craft\helpers\FileHelper;
use craft\events\RegisterCacheOptionsEvent;

use Yii;
use yii\base\Event;
use yii\base\InvalidConfigException;
use yii\base\Module;

use craft\services\Elements;
use craft\events\ElementEvent;
use craft\elements\Entry;
use craft\services\Revisions;

/**
 * Class PapertrainModule
 *
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 *
 * @property  papertrainServiceService $papertrainService
 */
class PapertrainModule extends Module
{
	// Static Properties
	// =========================================================================

	/**
	 * @var PapertrainModule
	 */
	public static $instance;

	// Public Methods
	// =========================================================================

	/**
	 * @inheritdoc
	 */
	public function __construct($id, $parent = null, array $config = [])
	{
		Craft::setAlias("@modules/papertrainmodule", $this->getBasePath());
		$this->controllerNamespace = "modules\papertrainmodule\controllers";

		// Translation category
		$i18n = Craft::$app->getI18n();
		/** @noinspection UnSafeIsSetOverArrayInspection */
		if (!isset($i18n->translations[$id]) && !isset($i18n->translations[$id . "*"])) {
			$i18n->translations[$id] = [
				"class" => PhpMessageSource::class,
				"sourceLanguage" => "en-US",
				"basePath" => "@modules/papertrainmodule/translations",
				"forceTranslation" => true,
				"allowOverrides" => true,
			];
		}

		Event::on(View::class, View::EVENT_REGISTER_CP_TEMPLATE_ROOTS, function (RegisterTemplateRootsEvent $e) {
			if (is_dir($baseDir = $this->getBasePath() . DIRECTORY_SEPARATOR . "templates")) {
				$e->roots["papertrain"] = $this->getBasePath() . DIRECTORY_SEPARATOR . "templates";
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

		Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_SITE_URL_RULES, function (RegisterUrlRulesEvent $event) {
			$event->rules["/papertrain/get-csrf"] = "papertrain-module/utility/get-csrf";
			$event->rules["/papertrain/block/<ownerId:\d+>/<blockId:\d+>"] = "papertrain-module/utility/render-block";
		});

		Event::on(Elements::class, Elements::EVENT_AFTER_SAVE_ELEMENT, function (ElementEvent $event) {
			// Trigger revision updates when an element is saved
			if ($event->element instanceof Entry  && !$event->element->isDraft && !$event->element->isRevision) {
				$entry = $event->element;
				PapertrainModule::getInstance()->viewService->updateEntryRevisions($entry);
			}
			// Trigger cache bust when an element with a URL is saved
			if (!empty($event->element->url) && !$event->element->isDraft && !$event->element->isRevision) {
				try {
					PapertrainModule::getInstance()->viewService->cachePage($event->element);
				} catch (\Exception $e) {
					Craft::error($e->getMessage(), __METHOD__);
				}
			}
		});

		// Register variable
		Event::on(CraftVariable::class, CraftVariable::EVENT_INIT, function (Event $event) {
			/** @var CraftVariable $variable */
			$variable = $event->sender;
			$variable->set("papertrain", PapertrainModuleVariable::class);
		});

		// Register cache busting utility
        Event::on(ClearCaches::class, ClearCaches::EVENT_REGISTER_CACHE_OPTIONS,
            function (RegisterCacheOptionsEvent $event) {
                $event->options[] = [
                    'key' => 'papertrain-page-cache',
                    'label' => "Cached pages",
                    'action' => function() {
                        PapertrainModule::getInstance()->viewService->clearCache();
                    }
                ];
            }
        );

		Craft::info(Craft::t("papertrain-module", "{name} module loaded", ["name" => "papertrain"]), __METHOD__);
	}

	// Protected Methods
	// =========================================================================
}
