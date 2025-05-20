Ext.define('Rd.view.aps.pnlApViewLink', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlApViewLink',
    ap_id       : undefined,
    apName      : undefined,    
    controller  : 'vcApViewLink',
    requires    : [
        'Rd.view.aps.vcApViewLink',
        'Rd.view.aps.pnlApViewLinkInternet',
        'Rd.view.components.pnlInternetSpeedTest',
        'Rd.view.aps.pnlApViewLinkClients'
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
        
        console.log("---Get info for--- "+me.ap_id);
        
              
        me.items = [
           /* {
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
            },*/
            {
    xtype: 'container',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },
    height: 70,
    cls: 'banner-c',
    items: [
        { xtype: 'box', flex: 1 },
        {
            xtype: 'box',
            itemId: 'lnkInternet',
            cls: 'banner-link',
            html: '<i class="x-fa fa-globe fa-2x"></i><br>Internet',
            listeners: {
                render: function(cmp) {
                    cmp.getEl().on('click', function() {
                        const parent = cmp.up('panel');
                        const controller = parent.getController();

                        parent.down('#lnkAccessPoint').removeCls('selected');
                        parent.down('#lnkClients').removeCls('selected');

                        // Add 'selected' class to this one
                        cmp.addCls('selected');

                        // Show the corresponding card
                        controller.showCard('cardInternet'); // or cardAccessPoint / cardClients
                    });

                }
            }
        },
        { xtype: 'box', width: 60, cls: 'connector-line' },
        {
            xtype: 'box',
            itemId: 'lnkAccessPoint',
            cls: 'banner-link selected',
            html: '<i class="x-fa fa-wifi fa-2x"></i><br>Access Point',
            listeners: {
                render: function(cmp) {                
                    cmp.getEl().on('click', function() {
                        const parent = cmp.up('panel');
                        const controller = parent.getController();                      
                        parent.down('#lnkInternet').removeCls('selected');
                        parent.down('#lnkClients').removeCls('selected');

                        // Add 'selected' class to this one
                        cmp.addCls('selected');

                        // Show the corresponding card
                        controller.showCard('cardAccessPoint'); // or cardAccessPoint / cardClients
                    });
                }
            }
        },
        { xtype: 'box', width: 60, cls: 'connector-line' },
        {
            xtype: 'box',
            itemId: 'lnkClients',
            cls: 'banner-link',
            html: '<i class="x-fa fa-tv fa-2x"></i><br>Clients',
            listeners: {
                render: function(cmp) {
                    cmp.getEl().on('click', function() {
                        const parent = cmp.up('panel');
                        const controller = parent.getController();

                        parent.down('#lnkInternet').removeCls('selected');
                        parent.down('#lnkAccessPoint').removeCls('selected');

                        // Add 'selected' class to this one
                        cmp.addCls('selected');

                        // Show the corresponding card
                        controller.showCard('cardClients'); // or cardAccessPoint / cardClients
                    });
                }
            }
        },
        { xtype: 'box', flex: 1 },
        {
            xtype       : 'button',
            scale       : 'large',
            margin      : 10,
            ui          : 'default-toolbar',
            text        : 'More Info',
            iconCls     : 'x-fa fa-plus',
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
                        xtype   : 'panel',
                        itemId  : 'cardClients',
                        apId    : me.ap_id,
                        xtype   : 'pnlApViewLinkClients'
                    }
                ]
            }
        ];
        
        this.callParent(arguments);
    }
});
