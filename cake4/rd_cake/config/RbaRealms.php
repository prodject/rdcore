<?php

$config = [];
$config['RbaRealms'] = [
    'admin'     => ['*'],
    'view'      => [
        
    ],
    'granular'  => [
        'indexCloud',
        'exportCsv',
        'index',
        'add',
        'edit',
        'view',
        'delete',
        'uploadLogo',
        'listRealmsForDynamicClientCloud',
        'viewRealmsForDynamicClient',
        'editRealmsForDynamicClient',
        'updateDynamicClientRealm',
        'listRealmsForNasCloud',
        'updateNasRealm',
        
        //Buttons
        'btnGraph',
        'btnLogo',
        'btnVlan',
        'btnPmk'
    ],
    'logActions'    => true,    //Flag to set if we want to actions logged
    'logExcludes'   => [
        'index'
    ]
];

return $config;

?>

