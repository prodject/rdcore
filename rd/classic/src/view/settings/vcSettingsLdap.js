Ext.define('Rd.view.settings.vcSettingsLdap', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcSettingsLdap',
    config  : {
        urlView  : '/cake4/rd_cake/settings/view-ldap.json',
        urlSave  : '/cake4/rd_cake/settings/save-ldap.json',
        UrlLdap  : '/cake4/rd_cake/settings/test-ldap.json'
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
        var pnl     = chk.up('form');
        var value   = chk.getValue();
        if(value){
            pnl.down('#btnLdapTest').setDisabled(false);
            pnl.down('#txtLdapBindPassword').enable();
        }else{
            pnl.down('#btnLdapTest').setDisabled(true);
            pnl.down('#txtLdapBindPassword').disable();
        }    
        pnl.query('field').forEach(function(item){
            if(value){
                item.setDisabled(false);                     
            }else{
                if(item.getItemId() !== 'chkLdapEnabled'){
                    item.setDisabled(true);   
                }        
           }                 
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
    onLdapTestClick : function(){
        var me = this;
        if(!Ext.WindowManager.get('winSettingsLdapTestId')){
            var w = Ext.widget('winSettingsLdapTest',{id:'winSettingsLdapTestId'});
            me.getView().add(w); 
            w.show();                 
        }     
    },
    onLdapTestOkClick : function(btn){
        var me      = this;
        var form    = btn.up('form');
        var win     = btn.up('window');
        form.setLoading(true);
        form.submit({
            clientValidation    : true,
            url                 : me.getUrlLdap(),
            success             : function(frm, action,) {              
                if(action.result.success == true){
                    win.down('#pnlLdapReply').setData(action.result.data);
                }
                form.setLoading(false);
            },
            failure  : Ext.ux.formFail
        });       
    },
});
