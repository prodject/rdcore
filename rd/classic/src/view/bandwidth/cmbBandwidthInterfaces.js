Ext.define('Rd.view.bandwidth.cmbBandwidthInterfaces', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbBandwidthInterfaces',
    forceSelection  : true,
    queryMode       : 'local',
    valueField      : 'id',
//    displayField    : 'type',
    typeAhead       : true,
    allowBlank      : false,
    mode            : 'local',
    name            : 'ap_id',
    tpl	            : Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div  class="x-boundlist-item">',
                '<div>',
                    "<tpl if='type == \"special\"'><span style=\"font-weight:bold;font-size:12px;\">{name}</span></tpl>",
                    "<tpl if='type == \"captive_portal\"'><span style=\"font-weight:bold;font-size:12px;\"><i class=\"fa fa-key\"></i> {type}</span></tpl>",
                    "<tpl if='type == \"nat\"'><span style=\"font-weight:bold;font-size:12px;\"><i class=\"fa fa-arrows-alt\"></i> {type}</span></tpl>",
                '</div>',
                '<tpl if="Ext.isEmpty(connects_with)"><div style=\"color:grey;font-size:12px;\">No SSID Connected</div></tpl>', 
                '<tpl for="connects_with">', 
                    '<div style=\"color:#006622;font-size:12px;\"><i class=\"fa fa-wifi\"></i> SSID {name}</div>',
                '</tpl>',
            '</div>',
        '</tpl>'
    ),
    displayTpl      : Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            "<tpl if='type == \"special\"'>{name}",
            '<tpl else>',
                '{type}',
                '<tpl if="Ext.isEmpty(connects_with)">(No SSID Connected)</tpl>', 
                '<tpl for="connects_with">',    
                    ' ({name}) ',
                '</tpl>',
            '</tpl>',
        '</tpl>'
    ),
    allOption       : false,
    dev_mode        : false,
    dev_id          : false,
    initComponent: function() {
        var me  = this;
        var s   = Ext.create('Ext.data.Store', {
            proxy: {
                type            : 'ajax',
                format          : 'json',
                batchActions    : true, 
                url             : '/cake4/rd_cake/bandwidth-reports/index-interfaces.json',
                extraParams: {
                    dev_mode: me.dev_mode,
                    dev_id  : me.dev_id
                },
                reader: {
                    type            : 'json',
                    rootProperty    : 'items',
                    messageProperty : 'message'
                }
            },
            autoLoad : true
        });        
        s.getProxy().setExtraParam('all_option',me.allOption);        
        me.store = s;
        this.callParent(arguments);
    }
});
