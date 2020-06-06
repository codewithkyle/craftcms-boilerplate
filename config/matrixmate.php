<?php

return [
    'fields' => [
        'contentBuilder' => [
            '*' => [
                'groups' => [
                    [
                        'label' => 'Hero Blocks',
                        'types' => ['carouselHero', 'standardHero', 'boldHero']
                    ],
                    [
                        'label' => 'Basic Content',
                        'types' => ['richText', 'image', 'video', 'horizontalRule'],
                    ],
                    [
                        'label' => 'Content Blocks',
                        'types' => ['testimonials', 'pullQuote', 'richTextImage'],
                    ],
                    [
                        'label' => 'Calls to Action Blocks',
                        'types' => ['blogCards', 'callToActionCards', 'callToActionBanner'],
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
                            [
                                'label' => 'Actions',
                                'fields' => ['callToActionButton'],
                            ],
                        ],
                        'defaultTabName' => 'Misc',
                    ],
                    'callToActionCards' => [
                        'tabs' => [
                            [
                                'label' => 'Copy',
                                'fields' => ['heading'],
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
                                'fields' => ['callToActionButton'],
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
                                'fields' => ['heading', 'copy'],
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
                        'types' => ['image', 'video'],
                    ],
                    [
                        'label' => 'Calls to Action',
                        'types' => ['callToActionBanner'],
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
                                'fields' => ['callToActionButton'],
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
                ],
                'hideUngroupedTypes' => true,
            ]
        ],
        'form' => [
            '*' => [
                'groups' => [
                    [
                        'label' => 'Inputs',
                        'types' => ['singleColumn', 'twoColumns', 'threeColumns'],
                    ],
                    [
                        'label' => 'Misc',
                        'types' => ['copy', 'pageBreak'],
                    ],
                ],
            ]
        ]
    ],
];
