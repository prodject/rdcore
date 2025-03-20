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
      //'emailUserDetails',
        'menuForGrid',
        'menuForUserDevices',
        'menuForAccountingData',
        'menuForAuthenticationData',
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
        'menuForGrid',
        'menuForUserDevices',
        'menuForAccountingData',
        'menuForAuthenticationData',
    ],
    'logActions'    => true,    //Flag to set if we want to actions logged
    'logExcludes'   => [
        'index'
    ]
];

return $config;

?>

