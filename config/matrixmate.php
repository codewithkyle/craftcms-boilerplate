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
