<?php

return [
    'fields' => [
        'contentBuilder' => [
            '*' => [
                'groups' => [
                    [
                        'label' => 'Basic Content',
                        'types' => ['richText', 'image', 'video', 'richTextImage', 'horizontalRule'],
                    ],
                    [
                        'label' => 'Content Blocks',
                        'types' => ['testimonials'],
                    ],
                    [
                        'label' => 'Calls to Action Blocks',
                        'types' => ['blogCards', 'callToActionCards', 'callToActionBanner'],
                    ],
                    [
                        'label' => 'Hero Blocks',
                        'types' => ['carouselHero', 'standardHero', 'boldHero']
                    ]
                ],
                'types' => [],
            ],
        ],
        'form' => [
            '*' => [
                'groups' => [
                    [
                        'label' => 'Inputs',
                        'types' => ['singleColumn', 'twoColumns', 'threeColumns'],
                    ],
                ],
            ]
        ]
    ],
];
