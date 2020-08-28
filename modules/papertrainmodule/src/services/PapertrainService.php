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
use craft\helpers\Template as TemplateHelper;
use craft\helpers\FileHelper;
use craft\web\View;

/**
 * @author    Kyle Andrews
 * @package   PapertrainModule
 * @since     1.0.0
 */
class PapertrainService extends Component
{
    // Public Methods
    // =========================================================================

    public function getFieldData($value)
    {
        $data = [];
        switch (gettype($value))
        {
            case "string":
                $data = $value;
                break;
            case "boolean":
                $data = $value ? "1" : "0";
                break;
            case "object":
                if (isset($value->elementType))
                {
                    switch ($value->elementType)
                    {
                        case "craft\\elements\\Asset":
                            $data = $value[0]->id;
                            break;
                        case "craft\\elements\\Category":
                            $data = $value[0]->id;
                            break;
                        case "craft\\elements\\Entry":
                            $data = $value[0]->id;
                            break;
                        case "craft\\elements\\User":
                            $data = $value[0]->id;
                            break;
                        case "verbb\\supertable\\elements\\SuperTableBlockElement":
                            if (!empty($value))
                            {
                                if (count($value) > 1)
                                {
                                    foreach ($value->all() as $block)
                                    {
                                        if (isset($block->ownerId) && isset($block->fieldId))
                                        {
                                            $data['pt-block-' . $block->fieldId] = $this->getSuperTableFields($block->ownerId, $block->fieldId);
                                        }
                                    }
                                    $remuxedData = [];
                                    foreach ($data as $block)
                                    {
                                        foreach ($block as $key => $fields)
                                        {
                                            $remuxedData[$key] = $fields;
                                        }
                                    }
                                    $data = $remuxedData;
                                }
                                else
                                {
                                    if (isset($value[0]->ownerId) && isset($value[0]->fieldId))
                                    {
                                        $data = $this->getSuperTableFields($value[0]->ownerId, $value[0]->fieldId);
                                    }
                                }
                            }
                            break;
                        case "craft\\elements\\MatrixBlock":
                            if (!empty($value))
                            {
                                if (count($value) > 1)
                                {
                                    foreach ($value->all() as $block)
                                    {
                                        if (isset($block->ownerId) && isset($block->id))
                                        {
                                            $data[] = $this->getMatrixBlockFields($block->ownerId, $block->id);
                                        }
                                    }
                                    $remuxedData = [];
                                    foreach ($data as $block)
                                    {
                                        foreach ($block as $key => $fields)
                                        {
                                            $remuxedData[$key] = $fields;
                                        }
                                    }
                                    $data = $remuxedData;
                                }
                                else
                                {
                                    if (isset($value[0]->ownerId) && isset($value[0]->id))
                                    {
                                        $data = $this->getMatrixBlockFields($value[0]->ownerId, $value[0]->id);
                                    }
                                }
                            }
                            break;
                        default:
                            if (isset($value->id))
                            {
                                // This field is some sort of element
                                $data = $value->id;
                            }
                            else
                            {
                                // Can't determine what this field is, probably something custom
                                $data = $value;
                            }
                            break;
                    }
                }
                else
                {
                    $data = $value;
                }
                break;
            default:
                break;
        }
        return $data;
    }

    public function getSuperTableFields(string $ownerId, string $fieldId)
    {
        $data = [];
        $blocks = \verbb\supertable\elements\SuperTableBlockElement::find()
                                ->ownerId($ownerId)
                                ->fieldId($fieldId)
                                ->all();
        foreach ($blocks as $block)
        {
            $fields = $block->getFieldLayout()->getFields();
            foreach ($fields as $field)
            {
                $value = $block->getFieldValue($field->handle);
                $data['matrix-' . $block->id][$field->handle] = $this->getFieldData($value);
            }
            $data['matrix-' . $block->id]['ptBlockType'] = $block->type->id;
        }
        return $data;
    }

    public function getMatrixBlockFields(string $ownerId, string $id)
    {
        $data = [];
        $blocks = \craft\elements\MatrixBlock::find()
                    ->ownerId($ownerId)
                    ->id($id)
                    ->all();
        foreach ($blocks as $block)
        {
            $fields = $block->getFieldValues();
            foreach ($fields as $key => $value)
            {
                $data['matrix-' . $block->id][$key] = $this->getFieldData($value);
            }
            $data['matrix-' . $block->id]['ptBlockType'] = $block->type->handle;
        }
        return $data;
    }

    public function getBlockData(string $id)
    {
        $data = [];
        $entry = \craft\elements\Entry::find()
                    ->section('demoBlocks')
                    ->with(['pageBuilder'])
                    ->id($id)
                    ->one();
        if (!empty($entry))
        {
            if (!empty($entry['pageBuilder']))
            {
                $block = \craft\elements\MatrixBlock::find()
                            ->ownerId($entry->id)
                            ->id($entry['pageBuilder'][0]->id)
                            ->one();
                $fields = $block->getFieldValues();
                foreach ($fields as $key => $value)
                {
                    $data[$key] = $this->getFieldData($value);
                }
            }
        }
        return $data;
    }

    public function getConfig()
    {
        $entries = \craft\elements\Entry::find()
                        ->section('demoBlocks')
                        ->all();
        $ret = [
            'groups' => [],
            'blocks' => [],
        ];
        foreach ($entries as $entry)
        {
            switch ($entry->type){
                case "pageBuilderGroup":
                    $ret['groups'][] = [
                        'handle' => $entry->slug,
                        'label' => $entry->title,
                    ];
                    break;
                case "pageBuilderBlock":
                    $resources = [];
                    $resourcesTable = $entry->getFieldValue('pageBuilderResources');
                    foreach ((array) $resourcesTable as $row)
                    {
                        $resources[] = $row['file'];
                    }
                    $block = \craft\elements\MatrixBlock::find()->ownerId($entry->id)->one();
                    $ret['blocks'][] = [
                        'handle' => $entry->slug,
                        'label' => $entry->title,
                        'group' => $entry->parent->slug ?? null,
                        'resources' => $resources,
                        'id' => $entry->id,
                    ];
                    break;
            }
        }
        return $ret;
    }

    public function renderBlock(string $id, string $handle)
    {
        $html = '';
        $entry = \craft\elements\Entry::find()
                    ->section('demoBlocks')
                    ->with(['pageBuilder'])
                    ->id($id)
                    ->one();
        if (!empty($entry))
        {
            $oldMode = Craft::$app->view->getTemplateMode();
            Craft::$app->view->setTemplateMode(View::TEMPLATE_MODE_SITE);
            $html = Craft::$app->view->renderTemplate('_blocks/' . $handle, [
                'data' => $entry['pageBuilder'][0],
                'imageFormat' => 'webp',
            ]);
            Craft::$app->view->setTemplateMode($oldMode);
        }
        return TemplateHelper::raw($html);
    }

    public function injectCriticalCSS($css)
    {
        $files = array();
        if (is_array($css))
        {
            $files = $css;
        }
        elseif (is_string($css))
        {
            $files[] = $css;
        }
        else
        {
            return;
        }

        $css = '';
        foreach ($files as $file)
        {
            $path = $_SERVER['DOCUMENT_ROOT'] . '/assets/' . $file . '.css';
            if (file_exists($path))
            {
                $css .= file_get_contents($path);
            }
        }
        $html = '<style>' . $css . '</style>';
        return TemplateHelper::raw($html);
    }
}
