<?php

use craft\elements\Entry;
use craft\helpers\UrlHelper;

return [
    'endpoints' => [
        'forms.json' => function() {
            return [
                'elementType' => Entry::class,
                'criteria' => ['section' => 'forms'],
                'transformer' => function(Entry $entry) {
                    return [
                        'title'     => $entry->title,
                        'id'        => $entry->id,
                        'created'   => $entry->dateCreated,
                        'expires'   => $entry->expiryDate,
                        'enabed'    => $entry->enabled,
                        'author'    => $entry->author->fullName,
                        'url'       => $entry->url,
                    ];
                },
            ];
        },
    ]
];