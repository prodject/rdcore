Ext.define('Rd.view.aps.cntApVpnEntry', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.cntApVpnEntry',
    requires: [
        'Rd.view.aps.vcApVpnEntry',
    ],
    controller  : 'vcApVpnEntry',
    vpn_id      : 0,
    bodyStyle   : 'background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%); border-radius: 10px;',
    margin      : 10,
    info        : {}, 
    initComponent: function(){
        var me          = this;
        var w_prim      = 550;
        var vpn_id      = me.vpn_id;  
        
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
                xtype       : 'textfield',
                fieldLabel  : 'Name',
                name        : vpn_id+'_name',
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                value       : me.info.name
            },
            {
                fieldLabel  : 'VPN Type',
                store       : sVpnTypes,
                name        : vpn_id+'_vpn_type',
                queryMode   : 'local',
                displayField: 'name',
                valueField  : 'id',
                xtype       : 'combobox',
                value       : me.info.vpn_type,
                labelClsExtra: 'lblRdReq',
                itemId      : 'cmbVpnType',
                width       : w_prim,
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Private Key',
                name        : vpn_id+'_wg_private_key',
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtWgPrivateKey',
                value       : me.info.wg_private_key
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Public Key',
                name        : vpn_id+'_wg_public_key',
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtWgPublicKey',
                value       : me.info.wg_public_key
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Address',
                name        : vpn_id+'_wg_address',
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtWgAddress',
                value       : me.info.wg_address
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Endpoint IP',
                name        : vpn_id+'_wg_endpoint',
                allowBlank  : false,
                labelClsExtra: 'lblRdReq',
                width       : w_prim,
                itemId      : 'txtWgEndpointIp',
                value       : me.info.wg_endpoint
            },
            {
                xtype       : 'numberfield',
                name        : vpn_id+'_wg_port',
                itemId      : 'nbrWgPort',
                fieldLabel  : 'Port',
                maxValue    : 65535,
                minValue    : 49152,
                labelClsExtra : 'lblRdReq',
                width       : w_prim,
                hideTrigger : true,
                keyNavEnabled  : false,
                mouseWheelEnabled	: false,
                value       : me.info.wg_port
            }
        ];       
        me.callParent(arguments);
    }
});
