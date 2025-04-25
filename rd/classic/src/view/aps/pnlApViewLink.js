Ext.define('Rd.view.aps.pnlApViewLink', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlApViewLink',
    ap_id       : undefined,
    apName      : undefined,
    
    controller  : 'vcApViewLink',
    requires    : [
        'Rd.view.aps.vcApViewLink'
    ],
    initComponent: function() {
        var me      = this;
        me.setTitle('AP VIEW LINK');
        me.callParent(arguments);
    },    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            height: 80,
            cls: 'banner-container',
            defaults: {
                xtype: 'button',
                scale: 'large',
                margin: '0 20 0 20',
                ui: 'default-toolbar'
            },
            items: [
                {
                    text: 'Internet',
                    iconCls: 'x-fa fa-globe',
                    handler: 'onInternetClick'
                },
                {
                    text: 'Access Point',
                    iconCls: 'x-fa fa-wifi',
                    handler: 'onApClick'
                },
                {
                    text: 'Clients',
                    iconCls: 'x-fa fa-users',
                    handler: 'onClientsClick'
                }
            ]
        },
        {
            xtype: 'container',
            itemId: 'pnlCardHolder',
            layout: 'card',
            flex: 1,
            items: [
                {
                    xtype: 'panel',
                    itemId: 'cardInternet',
                    html: 'Internet-related content here',
                    padding: 20
                },
                {
                    xtype: 'panel',
                    itemId: 'cardAccessPoint',
                    html: 'Access Point details here',
                    padding: 20
                },
                {
                    xtype: 'panel',
                    itemId: 'cardClients',
                    html: 'Client information here',
                    padding: 20
                }
            ]
        }
    ]
});
