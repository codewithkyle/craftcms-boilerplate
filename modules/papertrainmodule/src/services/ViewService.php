<?php
/**
 * papertrain module for Craft CMS 3.x
 *
 * Papertrain core
 *
 * @link      https://papertrain.io/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\papertrainmodule\services;

use modules\papertrainmodule\PapertrainModule;

use Craft;
use craft\base\Component;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\mail\Message;
use craft\helpers\UrlHelper;
use craft\base\Element;
use craft\elements\Entry;
use craft\elements\MatrixBlock;
use craft\helpers\Template as TemplateHelper;
use craft\web\View;

use Yii;

use GuzzleHttp\Client;

use modules\papertrainmodule\helpers\Cache;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class ViewService extends Component
{
	// Public Methods
	// =========================================================================

	public function renderBlock(int $ownerId, int $id): string
	{
		$html = "";
		$block = MatrixBlock::find()
			->ownerId($ownerId)
			->id($id)
			->one();
		if (!empty($block)) {
			$stringHelper = new StringHelper();
			$handle = $stringHelper->toKebabCase($block->getType());
			$oldMode = Craft::$app->view->getTemplateMode();
			Craft::$app->view->setTemplateMode(View::TEMPLATE_MODE_SITE);
			$html = Craft::$app->view->renderTemplate("_blocks/" . $handle, [
				"data" => $block,
			]);
			Craft::$app->view->setTemplateMode($oldMode);
		}
		return TemplateHelper::raw($html);
	}

	public function buildSEOTitle(Element $page): string
	{
		$seoInfo = \Craft::$app->getGlobals()->getSetByHandle("seo");
		$output = "";
		if (isset($page->seoTitle) && !empty($page->seoTitle)) {
			$output = $page->seoTitle;
		} else {
			$output = $page->title;
		}
		if (!empty($seoInfo->seoTitle)) {
			$tokens = ["{title}", "{ title }", "{title }", "{ title}"];
			$hasPageToken = false;
			foreach ($tokens as $token) {
				if (\strpos($seoInfo->seoTitle, $token) !== false) {
					$hasPageToken = true;
					break;
				}
			}
			if ($hasPageToken) {
				$output = \str_replace($tokens, $output, $seoInfo->seoTitle);
			} else {
				$output = $output . " - " . $seoInfo->seoTitle;
			}
		}
		return $output;
	}

	public function updateEntryRevisions(Element $entry): void
	{
		$number = (int) Cache::get($entry->id, 0);
		$number = $number + 1;
		Cache::set($entry->id, $number);
	}

	private function updateRealtedEntries(Element $entry): void
	{
		$relatedEntries = Entry::find()
			->relatedTo($entry)
			->all();
		foreach ($relatedEntries as $relatedEntry) {
			$number = (int) Cache::get($relatedEntry->id, 0);
			$number = $number + 1;
			Cache::set($relatedEntry->id, $number);
		}
	}

	public function checkRequireLogin(craft\base\Element $entry): bool
	{
		$requiresLogin = false;
		if (!empty($entry)) {
			$currEntry = $entry;
			do {
				if ($currEntry->requireLogin) {
					$requiresLogin = true;
					break;
				}
				$currEntry = $currEntry->getParent();
			} while ($currEntry !== null || $requiresLogin);
		}
		return $requiresLogin;
	}

	public function getRevisionNumber(string $elementId): string
	{
		return Cache::get($elementId, 0);
	}

	public function getCriticalCSS($filenames): string
	{
		$filenames = (array) $filenames;
		$html = "";
		foreach ($filenames as $file) {
			$filename = str_replace(".css", "", $file);
			$path = FileHelper::normalizePath(rtrim(Yii::getAlias("@webroot"), "/\\") . "/css/" . $filename . ".css");
			$css = $this->getFileContents($path);
			if (!empty($css)) {
				$html .= "<style>" . $css . "</style>";
			}
		}
		return $html;
	}

	private function getFileContents(string $path): string
	{
		$output = "";
		if (file_exists($path)) {
			$output = file_get_contents($path);
		}
		return $output;
	}
}
