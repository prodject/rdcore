Ext.define('Rd.view.aps.pnlApViewLink', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlApViewLink',
    ap_id       : undefined,
    apName      : undefined,
    
    controller  : 'vcApViewLink',
    requires    : [
        'Rd.view.aps.vcApViewLink',
        'Rd.view.aps.pnlApViewLinkInternet',
        'Rd.view.components.pnlInternetSpeedTest'
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
    initComponent: function() {
        const me = this;         
        me.items = [
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
                        text        : 'Access Point',
                        iconCls     : 'x-fa fa-wifi',
                        handler     : 'onApClick'
                    },
                    {
                        text: 'Clients',
                        iconCls: 'x-fa fa-users',
                        handler: 'onClientsClick'
                    }
                ]
            },
            {
                xtype       : 'container',
                itemId      : 'pnlCardHolder',
                layout      : 'card',
                flex        : 1,
                activeItem  : 1,  // Index of the item to show by default (0 = first, 1 = second, etc.)
                items: [ 
                    {
                        xtype   : 'pnlInternetSpeedTest',
                        dev_mode: 'ap',
                        dev_id  : me.ap_id,
                        itemId  : 'cardInternet',
                        padding : 20
                    },                 
                    {
                        xtype: 'panel',
                        itemId: 'cardAccessPoint',
                        html: '<h3>Access Point details here</h3>',
                        padding: 20
                    },                  
                    {
                        xtype: 'panel',
                        itemId: 'cardClients',
                        html: '<h3>Client information here</h3>',
                        padding: 20
                    }
                ]
            }
        ];
        
        this.callParent(arguments);
    }
});
