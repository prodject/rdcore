Ext.define('Rd.view.passpointUplinks.pnlPasspointUplinkAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlPasspointUplinkAddEdit',
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
    requires    : [
        'Rd.view.passpointUplinks.vcPasspointUplinkAddEdit',
    ],
    controller  : 'vcPasspointUplinkAddEdit',
    customFields : [
        'pnlNetwork',
        'pnlSignup',
        'idHessid',
        'idVenueName',
        'idVenueUrl'
    ], 
    initComponent: function(){
        var me          = this;
        var w_prim      = 550; 
        
        var cnt     = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [ 
                {
                    xtype       : 'textfield',
                    name        : 'id',
                    hidden      : true,
                    value	    : me.passpoint_uplink_id
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    name        : 'name',
                    allowBlank  : false
                },
                {
			        xtype       : 'checkbox',      
			        fieldLabel  : 'System Wide',
			        name        : 'system_wide'
		        },
                {
                    xtype       : 'component',
                    html        : 'Network Identification',
                    cls         : 'heading'
                }, 
                {
                    xtype      : 'radiogroup',
                    fieldLabel : 'Connection Type',
                    itemId     : 'rgrpConnectionType',
                    labelClsExtra   : 'lblRd', 
                    columns    : 2,
                    vertical   : false,
                    items: [                        
                        {
                            boxLabel   : 'WPA-Enterprise',
                            name       : 'connection_type',
                            inputValue : 'wpa_enterprise',
                            margin     : '0 15 0 0',
                            checked    : true
                        }, 
                        {
                            boxLabel   : 'Passpoint / Hotspot2.0',
                            name       : 'connection_type',
                            inputValue : 'passpoint',
                            margin     : '0 0 0 15'
                        }  
                    ]
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'SSID',
                    name        : 'ssid',
                    itemId      : 'txtSsid'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'RCOI',
                    name        : 'rcoi',
                    itemId      : 'txtRcoi',
                    hidden      : true,
                    disabled    : true,
                    labelClsExtra   : 'lblRd'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'NAI Realm',
                    name        : 'nai_realm',
                    itemId      : 'txtNai',
                    hidden      : true,
                    disabled    : true,
                    labelClsExtra   : 'lblRd'                    
                },				
                {
                    xtype       : 'component',
                    html        : 'Authentication Settings',
                    cls         : 'heading'
                },            
                {
                    xtype       : 'combo',
                    fieldLabel  : 'EAP Method',
                    itemId      : 'cmbEapMethod',
                    name        : 'eap_method',
                    value       : 'ttls_pap',
                    store       : [
                        ['peap', 'PEAP (MSCHAPv2)'],
                        ['ttls_pap', 'EAP-TTLS with PAP (Recommended)'],
                        ['ttls_chap', 'EAP-TTLS with MSCHAPv2'],
                        ['tls' , 'EAP-TLS (Certificate Based)']
                    ],
                    editable    : false,
                    forceSelection: true,
                    allowBlank  : false,
                    listeners   : {
                        change: 'onEapMethodChange'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Username',
                    name: 'identity',
                    itemId: 'txtUsername'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    inputType: 'password',
                    name: 'password',
                    itemId: 'txtPassword'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Outer Identity',
                    name: 'anonymous_identity',
                    itemId: 'txtOuterId'
                },
                {
                    xtype      : 'textareafield',
                    fieldLabel : 'CA Certificate (PEM)',
                    name       : 'ca_cert',
                    itemId     : 'txtCaCert',
                    grow       : true,
                    height     : 100,
                    emptyText  : 'Paste the full CA certificate here (-----BEGIN CERTIFICATE-----)',
                    allowBlank : false
                },
                {
                    xtype      : 'textareafield',
                    fieldLabel : 'Client Certificate (PEM)',
                    name       : 'client_cert',
                    itemId     : 'txtClientCert',
                    grow       : true,
                    height     : 100,
                    emptyText  : 'Paste the client certificate here (-----BEGIN CERTIFICATE-----)',
                    hidden     : true
                },
                {
                    xtype      : 'textareafield',
                    fieldLabel : 'Private Key (PEM)',
                    name       : 'private_key',
                    itemId     : 'txtPrivateKey',
                    grow       : true,
                    height     : 100,
                    emptyText  : 'Paste the private key here (-----BEGIN PRIVATE KEY-----)',
                    hidden     : true
                }
            ]
        };     
                                    
        me.items = [
            {
                xtype   : 'panel',
                layout  : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cnt				
            }      
        ]   
      
        me.callParent(arguments);
    }
});
