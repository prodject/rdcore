Ext.define('Rd.view.settings.pnlSettingsLdap', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlSettingsLdap',
    autoScroll	: true,
    plain       : true,
    frame       : false,
    layout      : {
        type    : 'vbox',
        pack    : 'start',
        align   : 'stretch'
    },
    margin      : 5,  
    fieldDefaults: {
        msgTarget       : 'under',
        labelAlign      : 'left',
        labelSeparator  : '',
        labelWidth      : Rd.config.labelWidth+20,
        margin          : Rd.config.fieldMargin,
        labelClsExtra   : 'lblRdReq'
    },
    buttons : [
        {
            itemId  : 'save',
            text    : 'SAVE',
            scale   : 'large',
            formBind: true,
            glyph   : Rd.config.icnYes,
            margin  : Rd.config.buttonMargin,
            ui      : 'button-teal'
        }
    ],
    requires: [
        'Rd.view.settings.vcSettingsLdap'
    ],
    controller  : 'vcSettingsLdap',
    listeners       : {
        activate  : 'onViewActivate'
    },
    initComponent: function(){
        var me      = this;
        var w_prim  = 550;
             
        var cntLdap  = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            defaultType : 'textfield',
            items       : [
                { 
                    fieldLabel      : 'Enable', 
                    name            : 'ldap_enabled', 
                    itemId          : 'chkLdapEnabled',
                    labelClsExtra   : 'lblRdReq',
                    checked         : false, 
                    xtype           : 'checkbox'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'LDAP Host',
                    name: 'host',
                    allowBlank: false,
                    value: 'ldap.example.com'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Bind DN',
                    name: 'bindDN',
                    allowBlank: false,
                    value: 'cn=admin,dc=example,dc=com'
                },
                {
                    xtype: 'textfield',
                    inputType: 'password',
                    fieldLabel: 'Bind Password',
                    name: 'bindPassword',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Base DN',
                    name: 'baseDN',
                    allowBlank: false,
                    value: 'dc=example,dc=com'
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Port',
                    name: 'port',
                    minValue: 1,
                    maxValue: 65535,
                    value: 389
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Use Secure Connection (LDAPS)',
                    name: 'useLdaps',
                    listeners: {
                        change: function (checkbox, newValue) {
                            let portField = checkbox.up('form').getForm().findField('port');
                            portField.setValue(newValue ? 636 : 389);
                        }
                    }
                }
            /*    {
                    fieldLabel      : 'User',
                    name            : 'mqtt_user',
                    itemId          : 'txtMqttUser',
                    allowBlank      : false,
                    blankText       : i18n('sSupply_a_value'),
                    labelClsExtra   : 'lblRdReq',
                    disabled        : true
                },
                {
                    xtype           : 'rdPasswordfield',
                    rdName          : 'mqtt_password',
                    itemId          : 'txtMqttPassword',
                    rdLabel         : 'Password',
                    disabled        : true
                },              
                {
                    fieldLabel      : 'Server URL',
                    name            : 'mqtt_server_url',
                    itemId          : 'txtMqttServerUrl',
                    allowBlank      : false,
                    blankText       : i18n('sSupply_a_value'),
                    labelClsExtra   : 'lblRdReq',
                    disabled        : true
                },
                {
                    fieldLabel      : 'Command Topic',
                    name            : 'mqtt_command_topic',
                    itemId          : 'txtMqttCommandTopic',
                    allowBlank      : false,
                    blankText       : i18n('sSupply_a_value'),
                    labelClsExtra   : 'lblRdReq',
                    disabled        : true
                }*/
            ]
        }
                            
        me.items = [
            {
                xtype       : 'panel',
                title       : "LDAP Integration",
                glyph       : Rd.config.icnDatabase, 
                ui          : 'panel-blue',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntLdap				
            }
        ];    
        me.callParent(arguments);
    }
});
