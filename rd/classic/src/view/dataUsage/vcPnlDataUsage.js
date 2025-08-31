Ext.define('Rd.view.dataUsage.vcPnlDataUsage', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcPnlDataUsage',
    config  : {
        span     : 'day',
        urlUsage : '/cake4/rd_cake/data-usages-new/usage-for-realm-new.json',
        usageType: 'realm' // can be client or user i think...
    },
    control: {
        'pnlDataUsage': {
            activate   : 'genChange'
        },
        'pnlDataUsage #reload' : {
            click       : 'genChange'        
        },    
        'pnlDataUsage #duCmbRealm' : {
            change      : 'genChange'        
        },
        'pnlDataUsage cmbTimezones' : {
            change      : 'genChange'
        },
        'pnlDataUsage #dtDate' : {
            change      : 'genChange'
        },
        'pnlDataUsage #toolReload' : {
            click   : 'activeReload'
        }
    },
    genChange: function(){
        var me = this;
        me.fetchStats();
    }, 
    onClickTodayButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Day');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Day');
        me.setSpan('day');
        me.genChange();
    },
    onClickThisWeekButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Week');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Week');
        me.setSpan('week');
        me.genChange();
    },
    onClickThisMonthButton: function(button){
        var me = this;
        me.lookup('btnTimeBack').setTooltip('Go Back 1Month');
        me.lookup('btnTimeForward').setTooltip('Go Forward 1Month');
        me.setSpan('month');
        me.genChange();
    },
    onClickRadiusClientsButton: function(button){
    
        var me = this;
        tp = button.up('tabpanel');
        var pnlDataUsage = button.up('pnlDataUsage');
        var tabDataUsageClients  = tp.items.findBy(function (tab){
            return tab.getXType() === 'pnlDataUsageClients';
        });
        
        if (!tabDataUsageClients){
            tabDataUsageClients = tp.insert(1,{ 
                title   : 'RADIUS Clients',  
                xtype   : 'pnlDataUsageClients',   
                glyph   : Rd.config.icnWifi,
                plain	: true,
                closable: true,
                timezone_id: pnlDataUsage.timezone_id, 
                tabConfig: {
                    ui: Rd.config.tabDtaUsageCl
                }
            });
        }     
        tp.setActiveTab(tabDataUsageClients);
    
    },
    onClickTimeBack: function(b){
        var me          = this;
        var picker      = me.lookup('dtDate');
        var step        = -1;
        var unit        = Ext.Date.DAY;
        if(me.getSpan()== 'week'){
            step        = -7;
        }
        if(me.getSpan()== 'month'){
            step        = -1;
            unit        = Ext.Date.MONTH;
        }
        me.lookup('btnTimeForward').setDisabled(false);
        var d_current   = picker.getValue();
        var d_back      = Ext.Date.add(d_current, unit, step);
        picker.setValue(d_back);
        
    },
    onClickTimeForward: function(b){
        var me          = this;
        var picker      = me.lookup('dtDate');
        var step        = 1;
        var unit        = Ext.Date.DAY;
        if(me.getSpan()== 'week'){
            step        = 7;
        }
        if(me.getSpan()== 'month'){
            step        = 1;
            unit        = Ext.Date.MONTH;
        }
        var d_current   = picker.getValue();
        var today       = new Date();
        var d_fwd       = Ext.Date.add(d_current, unit, step);
        if(Ext.Date.format(d_fwd,'timestamp') >= Ext.Date.format(today,'timestamp')){
            me.lookup('btnTimeForward').setDisabled(true);
            d_fwd  = today;
        }
        picker.setValue(d_fwd); 
    },
    fetchStats : function(){  
        var me  = this;    
        me.getView().setLoading(true);
        var day         = me.getView().down('#dtDate').getRawValue();
        var realm_id    =  me.getView().down('#duCmbRealm').getValue();
        var tz_id       = me.getView().down('cmbTimezones').getValue();      
        Ext.Ajax.request({
                url     : me.getUrlUsage(),
                params  : {
                    span        : me.getSpan(),
                    day         : day,
                    realm_id    : realm_id,
                    timezone_id : tz_id,
                    type        : me.getUsageType()
                },
                method: 'GET',
                success: function(response){
                    var jsonData = Ext.JSON.decode(response.responseText);
                    me.getView().setLoading(false);                
                    if(jsonData.success){
                        //Here we'll paintScreen()    
                        me.paintScreen(jsonData.data);
                    }
                }
            });
    },
    paintScreen : function(data){
        var me = this;
        
        if(data.query_info.historical){
            me.getView().down('#gridActive').hide();
        }else{
            me.getView().down('#gridActive').show();           
            var store = me.getView().down('#gridActive').getStore();
            store.getProxy().setExtraParams({
                realm_id  : me.getView().down('#duCmbRealm').getValue()
            });           
            store.reload();            
        }
        
        me.getView().down('cartesian').getStore().setData(data.graph.items);
        me.getView().down('#plrTop').getStore().setData(data.top);
        me.getView().down('#gridTop').getStore().setData(data.top);
        me.getView().down('#pnlSummary').setData(data.summary);  
    },
    activeReload : function(){
        var me = this;
        var store = me.getView().down('#gridActive').getStore();
        store.reload();   
    }
});
