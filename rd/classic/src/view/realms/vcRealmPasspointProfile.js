Ext.define('Rd.view.realms.vcRealmPasspointProfile', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcRealmPasspointProfile',
    init    : function() {
    
    },
    config: {
        urlSave         : '/cake4/rd_cake/realm-passpoint-profiles/save.json',
        urlView         : '/cake4/rd_cake/realm-passpoint-profiles/view.json',
        naiRealmCount   : 0,
        rcoiCount       : 0,
    },
    control: {
        'pnlRealmPasspointProfile': {  
            activate        : 'pnlActive'
        },
        '#save': {
           click   : 'btnSave'
        }
    },
    pnlAfterRender : function(){
        var me = this;
        var realm_id = me.getView().realm_id;
        console.log("After Render "+realm_id);    
    },
    pnlActive   : function(form){
        var me          = this; 
        var realm_id    = me.getView().realm_id;
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { realm_id: realm_id },
            success     : function(a,b,c){                                	
            	//me.warningCheck(); //Lastly                       
            }
        });            
    },
    warningCheck : function(){
        var me   = this;        
        var view = me.getView();
        
        var rcoi = view.down('#txtRcoi').getValue();
        var nai  = view.down('#txtNai').getValue();
        var rgrp = view.down('#rgrpConnectionType');
        
        if(rgrp.getValue().connection_type === 'wpa_enterprise'){ //No need to check wpa_enterprise
            return false;
        }

        if (Ext.isEmpty(rcoi) && Ext.isEmpty(nai)) {
            me.getView().down('#lblWarn').show();
            return true; // or stop submission, etc.
        }else{
            me.getView().down('#lblWarn').hide();
            return false;
        }        
    },
    btnSave:function(button){
        var me          = this;
        var formPanel   = this.getView();
      
        if(false){
            Ext.ux.Toaster.msg(
                'Specifiy RCOI or NAI Realm',
                'Add at least one RCOI or NAI Realm',
                Ext.ux.Constants.clsError,
                Ext.ux.Constants.msgError
            );
            return;
        }      
        var url         = me.getUrlSave();             
        //Checks passed fine...      
        formPanel.submit({
            clientValidation    : true,
            url                 : url,
            submitEmptyText     : false, // Set this in the form config
            success             : function(form, action) {
                if (formPanel.closable) {
                    formPanel.close();
                }
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    }
});
