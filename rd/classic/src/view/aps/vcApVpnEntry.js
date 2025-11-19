Ext.define('Rd.view.aps.vcApVpnEntry', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcApVpnEntry',
    config : {
        UrlApStaticOverrides        : '/cake4/rd_cake/ap-profiles/ap-static-entry-overrides-view.json'
    },
    init: function() {
        var me = this;
    },
    control: {
        '#btnDelete' : {
            click:  'btnDeleteClick'
        },
        'cntApVpnEntry' : {
            afterlayout: 'onBeforeShow' 
        },
        'cntApVpnEntry #cmbVpnType' : {
            change  : 'onCmbVpnTypeChange'
        }
    },
    btnDeleteClick : function(){
        var me = this;
        me.getView().destroy();
    
    },
    onCmbVpnTypeChange : function(combo){
        var me = this;
        var val = combo.getValue();
        if(val === 'wg'){
            me.getView().down('#cntWg').show();
            me.getView().down('#cntWg').enable();
            me.getView().down('#cntOvpn').hide();
            me.getView().down('#cntOvpn').disable();
        }
        
        if(val === 'ovpn'){
            me.getView().down('#cntOvpn').show();
            me.getView().down('#cntOvpn').enable();
            me.getView().down('#cntWg').hide();
            me.getView().down('#cntWg').disable();
        }    
    },
    onBeforeShow    : function(panel){
        var me = this;
        if(me.getView().info.vpn_type){
           //  Ext.defer(function () {
           //     console.log(me.getView().info.vpn_type);
                me.getView().down('#cmbVpnType').setValue(me.getView().info.vpn_type);
         //   }, 500);
        }
    }
});
