Ext.define('Rd.view.passpoint.cntRcois', {
    extend  : 'Ext.container.Container',
    alias   : 'widget.cntRcois',
    layout  : 'hbox',
    margin  : 0,
    mode    : 'add',
    count   : 1,
    initComponent: function(){
        var me      = this;
        me.items = [
            {
                xtype       : 'textfield',
                emptyText   : 'Name',
                allowBlank  : false,
                name        : 'rcoi_name_'+me.mode+'_'+me.count,
                margin      : 10,
            },
            {
                xtype       : 'textfield',
                emptyText   : 'Organization ID (RCIO)',
                allowBlank  : false,
                name        : 'rcoi_id_'+me.mode+'_'+me.count,
                width       : 290,
                margin      : 10,
            }, 
            {   
                xtype       : 'button',
                margin      : '10 0 0 0',
                tooltip     : 'Delete Domain',
                glyph       : Rd.config.icnDelete,
                listeners   : {
                    click  : 'btnDelRcoi'
                }
            } 
        ];

        me.callParent(arguments);
    }
});

