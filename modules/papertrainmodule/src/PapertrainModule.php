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

        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, function (RegisterUrlRulesEvent $event) {
            $event->rules["/pwa/cachebust.json"] = "papertrain-module/default/cachebust";
            $event->rules["/pwa/get-csrf"] = "papertrain-module/default/get-csrf";
        });

        // Trigger revision updates when an element is saved
        Event::on(Elements::class, Elements::EVENT_AFTER_SAVE_ELEMENT, function (ElementEvent $event) {
            if ($event->element instanceof Entry) {
                $entry = $event->element;
                $entryIds = [];
                $entryIds[] = $entry->id;
                $relatedEntries = Entry::find()
                    ->relatedTo($entry)
                    ->all();
                foreach ($relatedEntries as $relatedEntry) {
                    $entryIds[] = $relatedEntry->id;
                }
                PapertrainModule::getInstance()->pwaService->updateRevisions($entryIds);
            }
        });

        // Adds content cachebust file path to the list of things the Clear Caches tool can delete
        Event::on(ClearCaches::class, ClearCaches::EVENT_REGISTER_CACHE_OPTIONS, function (RegisterCacheOptionsEvent $event) {
            $event->options[] = [
                "key" => "pwa-offline-content-cache",
                "label" => Craft::t("papertrain-module", "PWA offline content cache"),
                "action" => FileHelper::normalizePath(Craft::$app->getPath()->getRuntimePath() . "/pwa/"),
            ];
        });

        PapertrainModule::getInstance()->pwaService->setupContentCache();

        Event::on(CraftVariable::class, CraftVariable::EVENT_INIT, function (Event $event) {
            /** @var CraftVariable $variable */
            $variable = $event->sender;
            $variable->set("papertrain", PapertrainModuleVariable::class);
        });

        Craft::info(Craft::t("papertrain-module", "{name} module loaded", ["name" => "papertrain"]), __METHOD__);
    }

    // Protected Methods
    // =========================================================================
}
