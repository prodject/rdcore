Ext.define('Rd.view.settings.vcSettingsLdap', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcSettingsLdap',
    config: {
        urlView  : '/cake4/rd_cake/settings/view.json',
        urlSave  : '/cake4/rd_cake/settings/save-ldap.json',
        UrlMqtt  : '/cake4/rd_cake/settings/test-ldap.json'
    }, 
    control: {
        'pnlSettingsLdap #save'    : {
            click   : 'save'
        },
        '#chkLdapEnabled' : {
            change : 'onChkLdapEnabledChange'
        }
    },
    onChkLdapEnabledChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        if(chk.getValue()){
        /*    form.down('#txtMqttUser').enable();
            form.down('#txtMqttPassword').enable();
            form.down('#txtMqttServerUrl').enable();
            form.down('#txtMqttCommandTopic').enable();*/
            
        }else{
          /*  form.down('#txtMqttUser').disable();
            form.down('#txtMqttPassword').disable();  
            form.down('#txtMqttServerUrl').disable();
            form.down('#txtMqttCommandTopic').disable();  */
        }
    },
    save: function(button){
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlSave(),
            success             : function(form, action) {              
                //FIXME reload store....
                Ext.ux.Toaster.msg(
                    i18n('sItem_updated'),
                    i18n('sItem_updated_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    },
    onViewActivate: function(pnl){
        var me = this;
        me.getView().setLoading(true);
        me.getView().load({url:me.getUrlView(), method:'GET',
			success : function(a,b){  
		        me.getView().setLoading(false);
            }
		});       
    }
});
