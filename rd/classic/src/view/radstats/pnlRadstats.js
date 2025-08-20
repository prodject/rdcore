Ext.define('Rd.view.radstats.pnlRadstats', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlRadstats',
    plain       : true,
    frame       : false,
    layout      : {
        type    : 'vbox',
        pack    : 'start',
        align   : 'stretch'
    },
    requires    : [
        'Rd.view.radstats.vcRadstats',
        'Rd.view.radstats.cmbRadstatsServers',
    ],
    controller  : 'vcRadstats',
    initComponent: function(){
    
        var me 	    = this;
        var scale   = 'small';
        var dd      = Ext.getApplication().getDashboardData();
        var m       = 5;
        var p       = 5;
        
        Ext.create('Ext.data.Store', {
            storeId : 'distroStore',
            fields  :[ 
                {name: 'id',         type: 'int'},
                {name: 'objtype',    type: 'string'},
                {name: 'requests',   type: 'int'}
            ]
        });
        
        Ext.create('Ext.data.Store', {
            storeId : 'loadStore',
            fields  :[ 
                {name: 'id',         type: 'int'},
                {name: 'hostname',   type: 'string'},
                {name: 'requests',   type: 'int'}
            ]
        });
        
        me.timezone_id = dd.user.timezone_id;
        
        // Model-less store; convert string -> number, keep nulls as null
        function intOrNull(v){ return (v===null || v===undefined || v==='') ? null : parseInt(v,10); }
        function floatOrNull(v){ return (v===null || v===undefined || v==='') ? null : parseFloat(v); }
        
        var store = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'time_unit', type: 'string' },
                { name: 'requests_acct', convert: intOrNull },
                { name: 'requests_coa',  convert: intOrNull },
                { name: 'requests_auth', convert: intOrNull },
                { name: 'avg_rtt_acct',  convert: floatOrNull },
                { name: 'avg_rtt_coa',   convert: floatOrNull },
                { name: 'avg_rtt_auth',  convert: floatOrNull },
                { name: 'id', type: 'int' }
            ],
            data: []         
        });
        
        var chart = {
            xtype: 'panel',
            width: '100%',
         //   height: '100%',
            layout: 'fit',
            items: [{
                xtype: 'cartesian',
                reference: 'radRequestsChart',
                itemId  : 'barTotals',
                store: store,
                insetPadding: 20,
                animation: true,
                legend: { docked: 'bottom' },
                interactions: ['itemhighlight'],
                axes: [{
                    type: 'category',
                    position: 'bottom',
                    fields: ['time_unit'],
                 //   title: { text: 'Time', fontSize: 12 },
                    label: {
                        textAlign: 'right',
                        rotate: { degrees: -45 }  // your "Wed\nHH:00" labels wrap nicely
                    },
                    grid: true
                }, {
                    type: 'numeric',
                    position: 'left',
                   // title: { text: 'Requests', fontSize: 12 },
                    grid: true,
                    minimum: 0
                }],
                series: [{
                    type: 'bar',
                    xField: 'time_unit',
                    yField: ['requests_auth','requests_acct', 'requests_coa' ],
                    title: ['Auth','Acct', 'CoA'],
                    stacked: false,        // grouped bars; set true for stacked
                    highlight: true,
                    style: { minGapWidth: 12 },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            var labelMap = {
                                requests_acct: 'Acct',
                                requests_coa:  'CoA',
                                requests_auth: 'Auth'
                            };
                            var yField = item.field; // the specific series field for this bar
                            var val = record.get(yField);
                            tooltip.setHtml(
                                Ext.String.format(
                                    '<div><b>{0}</b> @ {1}: {2}</div>',
                                    labelMap[yField] || yField,
                                    (record.get('time_unit') || '').replace('\n', ' '),
                                    Ext.util.Format.number(val, '0,000')
                                )
                            );
                        }
                    }
                }]
            }]
        }
                    
        me.dockedItems= [
            {
                xtype   : 'toolbar',
                dock    : 'top',
                items   : [
                    {  
                        glyph   : Rd.config.icnReload,    
                        scale   : scale, 
                        itemId  : 'reload',
                        ui      : 'button-orange',   
                        tooltip: i18n('sReload')
                    },
                    {
                        xtype       : 'cmbRadstatsServers',
                        allOption   : true,
                        width       : 200,
                        itemId      : 'cmbRadstatsServers',
                        value       : 0 
                    },
                    '|',
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnLeft,
                        reference   : 'btnTimeBack',
                        tooltip     : 'Go Back 1Day',
                        listeners   : {
                            click: 'onClickTimeBack'
                        }
                    },  
                    {
                        xtype       : 'datefield',
                        itemId      : 'dtDate',
                        reference   : 'dtDate',
                        name        : 'date',
                        format      : "d/m/Y",
                        value       : new Date(),
                        width       : 120
                    },
                    { 
                        scale       : scale, 
                        glyph       : Rd.config.icnRight,
                        reference   : 'btnTimeForward',
                        tooltip     : 'Go Forward 1Day',
                        disabled    : true,
                        listeners   : {
                            click: 'onClickTimeForward'
                        }
                    }, 
                    '|',
                    {
                        text        : 'Day',
                        glyph       : Rd.config.icnHourStart,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup : 'range',
                        allowDepress: false,
                        value       : 'day',
                        pressed     : true,
                        listeners   : {
                            click: 'onClickTodayButton'
                        }
                    }, 
                    {
                        text        : 'Week',
                        glyph       : Rd.config.icnHourHalf,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup: 'range',
                        allowDepress: false,
                        value       : 'week',
                        listeners   : {
                           click: 'onClickThisWeekButton'
                        }
                   }, 
                   {
                        text        : 'Month',
                        glyph       : Rd.config.icnHourEnd,
                        scale       : scale,
                        enableToggle: true,
                        toggleGroup: 'range',
                        allowDepress: false,
                        value       : 'month',
                        listeners   : {
                            click: 'onClickThisMonthButton'
                        }
                   },                  
                   { 
                        scale       : scale, 
                        glyph       : Rd.config.icnTime,
                        tooltip     : 'Timezone',
                        ui          : 'button-metal',   
                        menu        : [
                        {
                            xtype         : 'cmbTimezones', 
                            width         : 300, 
                            itemId        : 'cmbTimezone',
                            name          : 'timezone_id', 
                            labelClsExtra : 'lblRdReq',
                            labelWidth    : 100, 
                            padding       : 10,
                            margin        : 10,
                            value         : me.timezone_id,
                            listeners     : {
                                change  : function(cmb){
                                    var btn = cmb.up('button');
                                    btn.getMenu().hide();
                                    console.log(cmb.getValue());
                                }
                            }
                        }]
                    }
                ]
            }
        ];
        me.items = [
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items : [
                    {
                        xtype   : 'panel',
                        title   : 'Summary',
                        ui      : 'panel-blue',
                        border  : true,
                        margin  : m,
                        padding : p,
                        flex    : 1,
                        layout  : 'fit',
                        itemId  : 'dailyTotal',
                        tpl     : new Ext.XTemplate(                       
                            '<div class="sub-div-2" style="text-align: center;">', 
                                '<p style="font-size:250%;font-weight:bolder;color:#29465b;"><i class="fa fa-database"></i> {data_total}</p>',
                                    '<p style="font-size:130%;color:#808080;font-weight:bolder;">',
                                    '<i class="fa fa-arrow-circle-down"></i> {data_in}',
                                    '&nbsp;&nbsp;&nbsp;&nbsp;',
                                    '<i class="fa fa-arrow-circle-up"></i> {data_out}',
                                '</p>',
                            '</div>'
                        ),
                        data    : {
                        }
                    },
                    {
                        flex            : 1,
                        title           : 'Auth/Acct/POC Ratio',
                        ui              : 'panel-blue',
                        border          : true,
                        margin          : m,
                        padding         : p,
                        itemId          : 'plrAcctAuth',
                        xtype           : 'polar',
                        innerPadding    : 10,
                        interactions    : ['rotate', 'itemhighlight'],
                        store: Ext.data.StoreManager.lookup('distroStore'),
                        series: {
                           type         : 'pie',
                          
                           highlight    : true,
                           angleField   : 'requests',
                           label        : {
                               field    : 'name',
                               display  : 'rotate'
                           },
                           donut        : 10,    
                           tooltip : {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    tooltip.setHtml(
                                        "<h2>"+record.get('objtype')+"</h2><h3>"+record.get('requests')+"</h3>"                                                                          
                                    );
                                }
                            }    
                        },
                        data    : {
                        }
                    },
                    {
                        flex            : 1,
                        title           : 'Server Load-Balance',
                        ui              : 'panel-blue',
                        border          : true,
                        margin          : m,
                        padding         : p,
                        itemId          : 'plrSrvBalance',
                        xtype           : 'polar',
                        innerPadding    : 10,
                        interactions    : ['rotate', 'itemhighlight'],
                        store: Ext.data.StoreManager.lookup('loadStore'),
                        series: {
                           type         : 'pie',                       
                           highlight    : true,
                           angleField   : 'requests',
                           label        : {
                               field    : 'name',
                               display  : 'rotate'
                           },
                           donut        : 10,    
                           tooltip : {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    tooltip.setHtml(
                                        "<h2>"+record.get('hostname')+"</h2><h3>"+record.get('requests')+"</h3>"                                                                          
                                    );
                                }
                            }    
                        },
                        data    : {
                        }
                    },
                  
                ]
            },
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items   : chart
            }
        ];
        
                                    
        me.callParent(arguments);
    }
});
