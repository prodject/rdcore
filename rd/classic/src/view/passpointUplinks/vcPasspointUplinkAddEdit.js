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
        '#rgrpConnectionType': {  
            change        : 'onConnectionTypeChange'
        },
        '#save': {
         //   click   : 'btnSave'
        }
    },
    pnlAfterRender : function(){
        var me = this;
        var uplink_id = me.getView().passpoint_uplink_id;
        console.log("After Render "+uplink_id);    
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
        txtClientCert.setHidden(true);
        txtPrivateKey.setHidden(true);

        if (newVal === 'tls') {
            txtPassword.setHidden(true);         // no password for EAP-TLS
            txtClientCert.setHidden(false);
            txtPrivateKey.setHidden(false);
        }
    }
});
