Ext.define('Rd.view.bandwidth.vcViewBandwidth', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcViewBandwidth',
    config: {
        span        : 'hour',
        urlIndex    : '/cake4/rd_cake/bandwidth-reports/index.json',
        mac         : false
    },
    control: {
        'pnlViewBandwidth': {
            activate   : 'genChange'
        },
        'pnlViewBandwidth cmbBandwidthInterfaces' : {
            change  : 'genChange'        
        },
        'pnlViewBandwidth #reload' : {
            click  : 'genChange'        
        }
    },
    genChange: function(cmb){
        var me = this;
        me.fetchReport();
    },
    onClickHourButton: function(){
        var me = this;
        me.setSpan('hour');
        me.fetchReport();
    },
    onClickDayButton: function(){
        var me = this;
        me.setSpan('day');
        me.fetchReport();
    },
    onClickWeekButton: function(button){
        var me = this;
        me.setSpan('week');
        me.fetchReport();
    },    
    onClickTrafficButton: function(b){
        var me          = this;
       
    },
    onClickProtocolsButton: function(b){
        var me          = this;

    },   
    fetchReport : function(){  
        var me      = this;    
        me.getView().setLoading(true);
        var exit_id = me.getView().down('cmbBandwidthInterfaces').getValue();
        var tz_id   = me.getView().timezone_id;  
        Ext.Ajax.request({
            url: me.getUrlIndex(),
            params: {
                span        : me.getSpan(),
                dev_mode    : me.getView().dev_mode,
                dev_id      : me.getView().dev_id,
                timezone_id : tz_id,
                exit_id     : exit_id,
                mac         : me.getMac()
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
        me.getView().down('#barTraffic').getStore().setData(data.graph.items);
        me.getView().down('#plrTraffic').getStore().setData(data.top_traffic);
        me.getView().down('#pnlSummary').setData(data.summary);  
    }
});
