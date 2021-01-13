<?php
/**
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule\variables;

use modules\papertrainmodule\PapertrainModule;

use Craft;
use craft\helpers\Template as TemplateHelper;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class PapertrainModuleVariable
{
	// Public Methods
	// =========================================================================

	public function css(array $filenames): \Twig\Markup
	{
		return TemplateHelper::raw(PapertrainModule::getInstance()->viewService->getCriticalCSS($filenames));
	}

	public function getRevisionNumber(string $elementId): string
	{
		return PapertrainModule::getInstance()->viewService->getRevisionNumberFromRedis($elementId);
	}

	public function hash(string $string): string
	{
		return md5($string);
	}

	public function checkRequireLogin(craft\base\Element $entry): bool
	{
		return PapertrainModule::getInstance()->viewService->checkRequireLogin($entry);
	}
}
