<?php
/**
 * pwa module for Craft CMS 3.x
 *
 * Utilities for building a Craft CMS PWA
 *
 * @link      https://jintmethod.dev/
 * @copyright Copyright (c) 2019 Kyle Andrews
 */

namespace modules\pwamodule\services;

use modules\pwamodule\PwaModule;

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

/**
 * @author    Kyle Andrews
 * @package   PwaModule
 * @since     1.0.0
 */
class PwaModuleService extends Component
{
    // Public Methods
    // =========================================================================

    /*
     * @return mixed
     */
    public function cachebust()
    {
        $settings = include(FileHelper::normalizePath(Craft::$app->getPath()->getConfigPath() . '/pwa.php'));
        $timestamps = include(FileHelper::normalizePath(Craft::$app->getPath()->getConfigPath() . '/pwa-auto.php'));
        $cache = include(FileHelper::normalizePath(Craft::$app->getPath()->getRuntimePath() . '/pwa/cache.php'));
        if ($settings)
        {
            $response = [
                'success' => true,
                'contentCacheDuration' => $settings['contentCacheDuration'],
                'maximumContentPrompts' => $settings['maximumContentPrompts']
            ];

            // Sets resources cache timestamp based on automated cache busting when possible
            if ($timestamps)
            {
                $response['resourcesCache'] = $timestamps['resourcesCache'];
            }
            else
            {
                $response['resourcesCache'] = date('U');
            }

            // Sets content cache timestamp based on automated cache busting when possible
            if ($cache)
            {
                $response['contentCache'] = $cache['contentCache'];
            }
            else if ($timestamps)
            {
                $response['contentCache'] = $timestamps['contentCache'];
            }
            else
            {
                $response['contentCache'] = date('U');
            }
        }
        else
        {
            $response = [
                'success' => false,
                'error' => 'Failed to find pwa.php file in the config/ directory'
            ];
        }
        
        return $response;
    }

    public function updateRevisions(Array $entries)
    {
        $cache = new Cache();
        $cache->redis->init();

        foreach ($entries as $id)
        {
            if ($cache->exists($id))
            {
                $value = $cache->get($id);
                $value = $value + 1;
                $cache->set($id, $value);
            }
            else
            {
                $cache->set($id, '0');
                return '0';
            }
        }
        
    }

    public function setupContentCache()
    {
        $dirPath = FileHelper::normalizePath(Craft::$app->getPath()->getRuntimePath() . '/pwa');
        if (!is_dir($dirPath))
        {
            mkdir($dirPath);
        }

        if (!file_exists($dirPath . '/cache.php'))
        {
            $file = fopen($dirPath . '/cache.php', "w");
            fwrite($file,"<?php\nreturn [\n\t'contentCache' => '" . time() . "',\n];");
            fclose($file);
        }
    }

    public function submitForm($params)
    {
        $response = [
            "success" => true,
            "errors" => []
        ];

        // Quickly return fake success when a bot is detected
        $honeypot = $params['field1'];
        if (!empty($honeypot))
        {
            return $response;
        }

        $formId = $params['formId'];
        $form = Entry::find()
                ->id($formId)
                ->with(['form', 'form.singleColumn:inputs', 'form.twoColumns:inputs', 'form.threeColumns:inputs'])
                ->one();
        if (!$form)
        {
            $response['success'] = false;
            return $response;
        }

        if ($form['spamPrevention'] == 'simpleMath')
        {
            $firstNumber = $params['simple_math_first'];
            $secondNumber = $params['simple_math_second'];
            $usersAnswer = $params['spam_prevention'];
            $actualAnswer = $firstNumber + $secondNumber;
            if ($usersAnswer != $actualAnswer)
            {
                $response['success'] = false;
                $response['errors'][] = [
                    'input' => 'spam_prevention',
                    'error' => 'This answer provided was incorrect. Try again.',
                ];
            }
        }
        else if ($form['spamPrevention'] == 'recaptcha')
        {
            $key = Craft::$app->globals->getSetByHandle('formSettings')->getFieldValue('recaptchaPrivateKey');
            if (isset($params['recaptcha']) && !empty($key))
            {
                $token = $params['recaptcha'];
                $client = new Client();
                $recaptchaResponse = $client->request('POST', 'https://www.google.com/recaptcha/api/siteverify', [
                    'query' => [
                        'secret' => $key,
                        'response' => $token
                    ]
                ]);
                $result = json_decode($recaptchaResponse->getBody(), true);
                // Quickly return fake success when a bot is detected
                if (number_format($result['score'], 1) < 0.5)
                {
                    return $response;
                }
            }
        }

        $html = '<strong>Submitted: </strong> ' . date("F j, Y") . '<br>';
        foreach ($form['form'] as $block)
        {
            if (isset($block['inputs']))
            {
                foreach ($block['inputs'] as $input)
                {
                    $handle = StringHelper::toCamelCase($input->title);
                    if (isset($input['required']) && $input->required)
                    {
                        if ($input->type == 'checkboxes')
                        {
                            $html .= '<strong>' . $input->title . ':</strong><ul>';
                            $hasOneCheck = false;
                            foreach ($input['options'] as $option)
                            {
                                $optionHandle = StringHelper::toCamelCase($option['options']);
                                if (isset($params[$optionHandle]))
                                {
                                    $hasOneCheck = true;
                                    $html .= '<li>' . $option['options'] . '</li>';
                                }
                            }
                            if (!$hasOneCheck)
                            {
                                $response['success'] = false;
                                $response['errors'][] = [
                                    'input' => $handle,
                                    'error' => 'This field is required.'
                                ];
                            }
                            $html .= '</ul>';
                        }
                        else
                        {
                            if ($input->type == 'lightswitch')
                            {
                                if ($params[$handle] == 'on')
                                {
                                    $html .= '<strong>' . $input->title . ':</strong> true';
                                }
                                else
                                {
                                    $html .= '<strong>' . $input->title . ':</strong> false';
                                }
                                $html .= '<br>';
                            }
                            else
                            {
                                $html .= '<strong>' . $input->title . ':</strong> ' . $params[$handle];
                                $html .= '<br>';
                            }
                            if (empty($params[$handle]) || !isset($params[$handle]))
                            {
                                $response['success'] = false;
                                $response['errors'][] = [
                                    'input' => $handle,
                                    'error' => 'This field is required.'
                                ];
                            }
                        }
                    }
                }
            }
        }

        if ($response['success'])
        {
            $recipients = array_map('trim', explode(',', $form['recipients']));
            $this->_sendMail($html, 'New ' . $form->title . ' Response', $recipients);
            $this->_generateSubmissionEntry($form->title, $html);
        }

        return $response;
    }

    public function checkRequireLogin($entry)
    {
        $requiresLogin = false;
        $currEntry = $entry;
        do
        {
            if ($currEntry->requireLogin){
                $requiresLogin = true;
                break;
            }
            $currEntry = $currEntry->getParent();
        } while ($currEntry !== null || $requiresLogin);
        return $requiresLogin;
    }

    // Private Methods
    // =========================================================================

    private function _generateSubmissionEntry($title, $html): bool
    {
        $admin = \craft\elements\User::find()->admin()->one();
        $section = Craft::$app->sections->getSectionByHandle('formSubmissions');
        $entryTypes = $section->getEntryTypes();
        $entryType = reset($entryTypes);
        $entry = new Entry([
            'sectionId' => $section->id,
            'typeId' => $entryType->id,
            'fieldLayoutId' => $entryType->fieldLayoutId,
            'authorId' => $admin->id,
            'title' => date("Y-m-d H:i:s") . ' - ' . $title,
            'slug' => date("Y-m-d-H-i-s"),
            'postDate' => new \DateTime(),
        ]);
        $entry->setFieldValue('submissionData', $html);
        return Craft::$app->elements->saveElement($entry);
    }

    private function _sendMail($html, $subject, $mail = null, array $attachments = array()): bool
{
    $settings = Craft::$app->projectConfig->get('email');
    $message = new Message();

    $message->setFrom([$settings['fromEmail'] => $settings['fromName']]);
    $message->setTo($mail);
    $message->setSubject($subject);
    $message->setHtmlBody($html);
    if (!empty($attachments) && \is_array($attachments)) {

        foreach ($attachments as $fileId) {
            if ($file = Craft::$app->assets->getAssetById((int)$fileId)) {
                $message->attach($this->getFolderPath() . '/' . $file->filename, array(
                    'fileName' => $file->title . '.' . $file->getExtension()
                ));
            }
        }
    }

    return Craft::$app->mailer->send($message);
}
}
