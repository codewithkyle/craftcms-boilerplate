<?php

return [
    'fields' => [
        'pageBuilder' => [
            '*' => [
                'groups' => [
                    [
                        'label' => 'Hero Blocks',
                        'types' => ['carouselHero', 'standardHero', 'boldHero']
                    ],
                    [
                        'label' => 'Basic Content',
                        'types' => ['richText', 'imageBlock', 'richTextImage', 'videoBlock'],
                    ],
                    [
                        'label' => 'Rich Content Blocks',
                        'types' => ['testimonialsBlock', 'pullQuote'],
                    ],
                    [
                        'label' => 'Calls to Action Blocks',
                        'types' => ['blogCards', 'callToActionCards', 'callToActionBanner'],
                    ],
                    [
                        'label' => 'Layout Blocks',
                        'types' => ['horizontalRule', 'spacerBlock'],
                    ],
                ],
                'types' => [
                    'carouselHero' => [
                        'tabs' => [
                            [
                                'label' => 'Slides',
                                'fields' => ['slides'],
                            ],
                            [
                                'label' => 'Settings',
                                'fields' => ['automaticTransition'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'standardHero' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Background',
                                'fields' => ['backgroundColor', 'backgroundImage'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToAction', 'secondaryAction'],
                            ]
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'boldHero' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Background',
                                'fields' => ['image'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToAction', 'secondaryAction'],
                            ]
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'blogCards' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Articles',
                                'fields' => ['articles'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'callToActionCards' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Cards',
                                'fields' => ['cards'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'callToActionBanner' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Background',
                                'fields' => ['backgroundColor', 'backgroundImage'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton', 'secondaryCallToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'richText' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton', 'buttonStyle'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'richTextImage' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy', 'verticalAlignment'],
                            ],
                            [
                                'label' => 'Image',
                                'fields' => ['image', 'imagePosition'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton', 'buttonStyle'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'video' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Video',
                                'fields' => ['source', 'videoId', 'thumbnailImage'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'pullQuote' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['quote', 'author', 'callToActionLink'],
                            ],
                            [
                                'label' => 'Image',
                                'fields' => ['image',],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'testimonials' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Testimonials',
                                'fields' => ['testimonials'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                ],
            ],
            'section:articles' => [
                'groups' => [
                    [
                        'label' => 'Copy',
                        'types' => ['richText', 'richTextImage', 'pullQuote'],
                    ],
                    [
                        'label' => 'Media',
                        'types' => ['imageBlock', 'videoBlock'],
                    ],
                    [
                        'label' => 'Calls to Action',
                        'types' => ['callToActionBanner', 'callToActionCards'],
                    ]
                ],
                'types' => [
                    'callToActionBanner' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Background',
                                'fields' => ['backgroundColor', 'backgroundImage'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton', 'secondaryCallToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'richText' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'richTextImage' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Image',
                                'fields' => ['image', 'imagePosition'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'video' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Video',
                                'fields' => ['source', 'videoId', 'thumbnailImage'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'callToActionCards' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading', 'copy'],
                            ],
                            [
                                'label' => 'Cards',
                                'fields' => ['cards'],
                            ],
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                ],
                'hideUngroupedTypes' => true,
            ]
        ],
    ],
];
