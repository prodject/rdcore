Ext.define('Rd.view.passpointUplinks.vcPasspointUplinkAddEdit', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcPasspointUplinkAddEdit',
    init    : function() {
    
    },
    config: {
        urlAdd          : '/cake4/rd_cake/passpoint-uplinks/add.json',
        urlEdit         : '/cake4/rd_cake/passpoint-uplinks/edit.json',
        urlView         : '/cake4/rd_cake/passpoint-uplinks/view.json',
        domainCount     : 0,
        naiRealmCount   : 0,
        rcoiCount       : 0,
        cellNetworkCount: 0,
    },
    control: {
        'pnlPasspointUplinkAddEdit': {  
            activate        : 'pnlActive'
        },
        '#rgrpConnectionType': {  
            change        : 'onConnectionTypeChange'
        },
        '#save': {
           click   : 'btnSave'
        }
    },
    pnlAfterRender : function(){
        var me = this;
        var uplink_id = me.getView().passpoint_uplink_id;
        console.log("After Render "+uplink_id);    
    },
    pnlActive   : function(form){
        var me          = this; 
        var uplink_id  = me.getView().passpoint_uplink_id;

        if(uplink_id == 0){
            return; //add - no need to load
        } 
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { uplink_id: uplink_id },
            success     : function(a,b,c){                                	
            	me.warningCheck(); //Lastly                       
            }
        });            
    },
    onConnectionTypeChange: function(radioGroup, newValue) {
        var me          = this;
        var txtSsid     = me.getView().down('#txtSsid');
        var txtRcoi     = me.getView().down('#txtRcoi');
        var txtNai      = me.getView().down('#txtNai');
        if(newValue.connection_type === 'wpa_enterprise') {
            txtSsid.setHidden(false);
            txtSsid.setDisabled(false);
            txtRcoi.setHidden(true);
            txtRcoi.setDisabled(true);
            txtNai.setHidden(true);
            txtNai.setDisabled(true);
        } else {
            txtSsid.setHidden(true);
            txtSsid.setDisabled(true);
            txtRcoi.setHidden(false);
            txtRcoi.setDisabled(false);
            txtNai.setHidden(false);
            txtNai.setDisabled(false);
        }
    },
    onEapMethodChange: function(combo, newVal) {
        var view            = this.getView();
        var txtUsername     = view.down('#txtUsername');
        var txtPassword     = view.down('#txtPassword');
        var txtOuterId      = view.down('#txtOuterId');
        var txtCaCert       = view.down('#txtCaCert');
        var txtClientCert   = view.down('#txtClientCert');
        var txtPrivateKey   = view.down('#txtPrivateKey');

        // Reset all fields visibility
        txtUsername.setHidden(false);
        txtPassword.setHidden(false);
        txtOuterId.setHidden(false);
        txtCaCert.setHidden(false);       
        txtUsername.setDisabled(false);
        txtPassword.setDisabled(false);
        txtOuterId.setDisabled(false);
        txtCaCert.setDisabled(false);       
        txtClientCert.setHidden(true);
        txtPrivateKey.setHidden(true);
        txtClientCert.setDisabled(true);
        txtPrivateKey.setDisabled(true);

        if (newVal === 'tls') {
            txtPassword.setHidden(true);         // no password for EAP-TLS
            txtPassword.setDisabled(true);         // no password for EAP-TLS            
            txtClientCert.setHidden(false);
            txtPrivateKey.setHidden(false);
            txtClientCert.setDisabled(false);
            txtPrivateKey.setDisabled(false);
        }
    },
    warningCheck : function(){
        var me = this;
      //  var txtTest = me.getView().down('#cntServiceProviders').down('textfield');
       // if(txtTest){
       //     me.getView().down('#cntServiceProviders').down('#lblWarn').hide();
            return false;
      //  }else{
      //      me.getView().down('#cntServiceProviders').down('#lblWarn').show();
      //      return true;
      //  }        
    },
    btnSave:function(button){
        var me          = this;
        var formPanel   = this.getView();
        
        if(me.warningCheck()){
            Ext.ux.Toaster.msg(
                'Add a service provider',
                'Add at least one service provider',
                Ext.ux.Constants.clsError,
                Ext.ux.Constants.msgError
            );
            return;
        }
        
        var url         = me.getUrlEdit();
        if(me.getView().passpoint_uplink_id == 0){
            url = me.getUrlAdd();   
        }
             
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
    },
});
