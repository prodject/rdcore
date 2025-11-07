Ext.define('Rd.view.aps.cntApVpnEntry', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.cntApVpnEntry',
    requires: [
        'Rd.view.aps.vcApVpnEntry',
    ],
    controller  : 'vcApVpnEntry',
    info        : {},
    bodyStyle   : 'background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%); border-radius: 10px;',
    margin      : 10,
  //  border      : true,
    initComponent: function(){
        var me          = this;
        var w_prim      = 550;
        var vpn_id      = me.info.vpn_id;  
        
        var sVpnTypes = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":'ipsec',  "name":'L2TP/IPSec'},
                {"id":'ovpn',   "name":'OpenVPN'},
                {"id":'wg',     "name":'Wireguard'},
                {"id":'zerot',  "name":'ZeroTier'},
            ]
        });
        
        me.width = w_prim + 30; 
                        
        me.items        = [
            {
                xtype   : 'container',
                layout      : {
                    type    : 'hbox',
                    pack    : 'end'
                },
                items   : [ 
                    {
                        xtype   : 'button',
                        itemId  : 'btnDelete',
                        glyph   : Rd.config.icnDelete
                    }
                ]
            },
            {
                fieldLabel  : 'VPN Type',
                store       : sVpnTypes,
                name        : 'vpn_type_'+vpn_id,
                queryMode   : 'local',
                displayField: 'name',
                valueField  : 'id',
                xtype       : 'combobox',
                value       : 'wg',
                labelClsExtra: 'lblRdReq',
                itemId      : 'cmbVpnType',
                width       : w_prim,
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Private Key',
                name        : 'wg_private_key'+vpn_id,
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtPrivateKey',
                value       : me.info.private_key
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Public Key',
                name        : 'wg_public_key'+vpn_id,
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtPublicKey',
                value       : me.info.public_key
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Endpoint IP',
                name        : 'wg_endpoint_ip'+vpn_id,
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtEndpointIp',
                value       : me.info.endpoint_ip
            }
        ];       
        me.callParent(arguments);
    }
});
