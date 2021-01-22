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
use yii\redis\Cache;
use yii\redis\Connection;
use craft\helpers\StringHelper;
use GuzzleHttp\Client;
use craft\mail\Message;
use craft\helpers\UrlHelper;
use craft\elements\Entry;
use Yii;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class ViewService extends Component
{
	// Public Methods
	// =========================================================================

	public function updateEntryRevisions(Entry $entry): void
	{
		$relatedEntries = Entry::find()
			->relatedTo($entry)
			->all();
		$cache = new Cache();
		$cache->redis->init();
		foreach ($relatedEntries as $relatedEntry) {
			if ($cache->exists($id)) {
				$value = $cache->get($id);
				$value = $value + 1;
				$cache->set($id, $value);
			} else {
				$cache->set($id, "0");
			}
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

	public function getRevisionNumberFromRedis(string $elementId): string
	{
		$revision = "0";
		$cache = new Cache();
		$cache->redis->init();
		if ($cache->exists($elementId)) {
			$revision = $cache->get($elementId);
		} else {
			$cache->set($elementId, "0");
		}
		return $revision;
	}

	public function getCriticalCSS(array $filenames): string
	{
		$html = "";
		foreach ($filenames as $file) {
			$filename = str_replace(".css", "", $file);
			$path = FileHelper::normalizePath(rtrim(Yii::getAlias("@webroot"), "/\\") . "/assets/" . $filename . ".css");
			$css = $this->getFileContents($path);
			if (!empty($css)) {
				$html .= '<style file="' . $filename . '.css">' . $css . "</style>";
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
