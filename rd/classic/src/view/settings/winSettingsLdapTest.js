Ext.define('Rd.view.settings.winSettingsLdapTest', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winSettingsLdapTest',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Test Ldap Settings',
    width       : 500,
    height      : 450,
    plain       : true,
    border      : false,
    layout      : 'fit',
    glyph       : Rd.config.icnData,
    autoShow    : false,
    defaults    : {
            border: false
    },
    requires: [
        'Ext.form.field.Text'
    ],
    cloud_id    : -1,
     initComponent: function() {
        var me = this;  
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            defaults: {
                anchor: '100%'
            },
            itemId:     'scrnData',
            autoScroll: true,
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'left',
                labelSeparator  : '',
                labelClsExtra   : 'lblRd',
                labelWidth      : Rd.config.labelWidth,
                margin          : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            buttons: [
                {
                    xtype       : 'btnCommon',
                    itemId      : 'btnLdapTestOK',
                    listeners   : {
                        click     : 'onLdapTestOkClick'
                    }   
                }        
            ],
            items: [
                    {
                        xtype           : 'textfield',
                        fieldLabel      : 'Username',
                        name            : "username",
                        allowBlank      : false,
                        blankText       : i18n('sSupply_a_value'),
                        labelClsExtra   : 'lblRdReq'
                    },
                    {
                        xtype           : 'rdPasswordfield',
                        rdName          : 'password',
                        rdLabel         : 'Password'
                    },
                    {
                        xtype   : 'panel',
                        itemId  : 'pnlLdapReply',
                        tpl	    : new Ext.XTemplate(
                            "<div style='padding:5px;'>",
                                '<tpl for=".">',
                                    '<div>{message}</div>',
                                '</tpl>',
                            "</div>",                
                        ),
                        data    : []
                    }
            ]
        });
        me.items = frmData;
        me.callParent(arguments);
    }
});
