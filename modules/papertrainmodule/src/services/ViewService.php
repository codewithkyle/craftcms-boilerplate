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

	public function getCachedPage(Element $element)
	{
		$pageCachePath = FileHelper::normalizePath($this->getPageCachePath() . "/" . $element->uid . ".html");
		if (file_exists($pageCachePath)) {
			return \file_get_contents($pageCachePath);
		}
		return null;
	}

	public function clearCache(): void
	{
		$pageCachePath = $this->getPageCachePath();
		if (is_dir($pageCachePath)) {
			array_map('unlink', glob("$pageCachePath/*"));
		}
	}

	public function purgeCSS(string $cssPath, string $htmlPath, string $pageCachePath): string
	{
		$nodejs = getenv("NODEJS");
		if (empty($nodejs)) {
			throw new \Exception("Your .env file is missing the path to your NODEJS binary.");
		}
		$uid = StringHelper::UUID();
		$tempCSS = FileHelper::normalizePath($pageCachePath . "/" . $uid . ".css");
		$files = array_diff(scandir($cssPath), array('.', '..'));
		foreach ($files as $file) {
			file_put_contents($tempCSS, \file_get_contents(FileHelper::normalizePath($cssPath . "/" . $file)), FILE_APPEND);
		}
		$css = shell_exec($nodejs . " " . FileHelper::normalizePath(Yii::getAlias("@root") . '/modules/papertrainmodule/purgecss/purge.js') . " --html=" . $htmlPath . " --css=" . $tempCSS);
		\unlink($tempCSS);
		if (\is_null($css)){
			throw new \Exception("Failed to purge CSS");
		}
		return $css;
	}

	public function renderTemplate(string $template, Element $page): string
	{
		$oldMode = Craft::$app->view->getTemplateMode();
		Craft::$app->view->setTemplateMode(View::TEMPLATE_MODE_SITE);
		$html = Craft::$app->view->renderTemplate($template, [
			"entry" => $page,
			"product" => $page,
			"category" => $page,
			"nocache" => "1",
			"isPrecacheRender" => "1",
		]);
		Craft::$app->view->setTemplateMode($oldMode);
		$html = TemplateHelper::raw($html);
		return $html;
	}

	public function getPageCSS(Element $page): string
	{
		$template = $page->route[1]["template"] ?? null;
		$variables = $page->route[1]["variables"] ?? [];
		$css = "";
		if (!is_null($template)) {
			$pageCachePath = $this->getPageCachePath();
			$uid = StringHelper::UUID();
			$tempHTML = FileHelper::normalizePath($pageCachePath . "/" . $uid . ".tmp");
			$html = $this->renderTemplate($template, $page, $pageCachePath);
			file_put_contents($tempHTML, $html);
			$cssPath = FileHelper::normalizePath(Yii::getAlias("@webroot") . '/css');
			$css = $this->purgeCSS($cssPath, $tempHTML, $pageCachePath);
			\unlink($tempHTML);
		}
		return $css;
	}

	public function cachePage(Element $page): void
	{
		if (getenv("env") !== "production") {
			return;
		}

		$template = $page->route[1]["template"] ?? null;
		$variables = $page->route[1]["variables"] ?? [];

		if (!is_null($template)) {
			$pageCachePath = $this->getPageCachePath();
			$cachedHTML = FileHelper::normalizePath($pageCachePath . "/" . $page->uid . ".html");
			if (file_exists($cachedHTML)) {
				unlink($cachedHTML);
			}
			$html = $this->renderTemplate($template, $page);
			$css = $this->getPageCSS($page);
			$html = str_replace("<!-- PURGE_CSS_INJECTION -->", "\n<style>" . $css . "</style>\n" . "</head>", $html);
			$html = trim($html);
			\file_put_contents($cachedHTML, $html);
		}
	}

	private function getPageCachePath(): string
	{
		$pageCachePath = FileHelper::normalizePath(Craft::$app->path->runtimePath . '/page-cache');
		if (!file_exists($pageCachePath)) {
			mkdir($pageCachePath);
		}
		return $pageCachePath;
	}

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
