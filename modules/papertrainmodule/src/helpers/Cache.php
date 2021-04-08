<?php

namespace modules\papertrainmodule\helpers;

use Craft;

class Cache
{
	public static function get($key, $fallback = null)
	{
		$output = $fallback;
		if (Craft::$app->cache->exists($key)) {
			$output = Craft::$app->cache->get($key);
		}
		return $output;
	}

	public static function set($key, $value): void
	{
		Craft::$app->cache->set($key, $value);
	}
}
