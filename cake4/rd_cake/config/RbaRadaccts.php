<?php

$config = [];
$config['RbaRadaccts'] = [
    'admin'     => ['*'],
    'view'      => [
        'exportCsv',
        'indexWithSpan',
        'index',
        //'delete',
        'kickActiveUsername',
        'kickActive',
        'closeOpen',
      
        //Buttons
        //'btnKickActive',
        //'btnCloseOpen',
    ],
    'granular'  => [
        'exportCsv',
        'indexWithSpan',
        'index',
        //'delete',
        'kickActiveUsername',
        'kickActive',
        'closeOpen',
      
        //Buttons
        //'btnKickActive',
        //'btnCloseOpen',
    ],
    'logActions'    => true,    //Flag to set if we want to actions logged
    'logExcludes'   => [
        'index'
    ]
];

return $config;

?>

