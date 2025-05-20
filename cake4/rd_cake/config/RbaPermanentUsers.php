<?php

$config = [];
$config['RbaPermanentUsers'] = [
    'admin'     => ['*'],
    'view'      => [
        'exportCsv',
        'index',
       //'add',
       //'import',
      //'delete',
        'viewBasicInfo',
      //'editBasicInfo',
        'viewPersonalInfo',
      //'editPersonalInfo',
        'privateAttrIndex',
      //'privateAttrAdd',
      //'privateAttrEdit',
      //'privateAttrDelete',
      //'restrictListOfDevices',
      //'autoMacOnOff',
        'viewPassword',
      //'changePassword',
      //'emailUserDetails'
    ],
    'granular'  => [
        'exportCsv',
        'index',
        'add',
        'import',
        'delete',
        'viewBasicInfo',
        'editBasicInfo',
        'viewPersonalInfo',
        'editPersonalInfo',
        'privateAttrIndex',
        'privateAttrAdd',
        'privateAttrEdit',
        'privateAttrDelete',
        'restrictListOfDevices',
        'autoMacOnOff',
        'viewPassword',
        'changePassword',
        'emailUserDetails',
        'enableDisable'
    ],
    'logActions'    => true,    //Flag to set if we want to actions logged
    'logExcludes'   => [
        'index'
    ]
];

return $config;

?>

