Ext.define('Rd.view.passpoint.vcPasspointAddEdit', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcPasspointAddEdit',
    init    : function() {
    
    },
    config: {
        urlSave         : '/cake4/rd_cake/passpoint-profiles/add.json',
        urlView         : '/cake4/rd_cake/passpoint-profiles/view.json',
        domainCount     : 0,
        naiRealmCount   : 0,
        rcoiCount       : 0,
        cellNetworkCount: 0,
    },
    control: {
        'pnlPasspointAddEdit': {  
            addDomain       : 'addDomain',
            addNaiRealm     : 'addNaiRealm',
            addRcoi         : 'addRcoi',
            addCellNetwork  : 'addCellNetwork'
        },
        '#save': {
            click   : 'btnSave'
        }
    },
    addDomain: function(btn){
        var me      = this;
        me.setDomainCount(me.getDomainCount()+1);
        me.getView().down('#cntDomains').add({
            xtype   : 'cntPasspointDomains',
            mode    : 'add',
            count   : me.getDomainCount() 
        })
    },
    btnDelDomain: function(btn){
        var me      = this;
        btn.up('cntPasspointDomains').destroy();
    },
    addNaiRealm: function(btn){
        var me      = this;
        me.setNaiRealmCount(me.getNaiRealmCount()+1);
        me.getView().down('#cntNaiRealms').add({
            xtype   : 'cntNaiRealms',
            mode    : 'add',
            count   : me.getNaiRealmCount() 
        })
    },
    btnDelNaiRealm: function(btn){
        var me      = this;
        btn.up('cntNaiRealms').destroy();
    },
    addRcoi: function(btn){
        var me      = this;
        me.setRcoiCount(me.getRcoiCount()+1);
        me.getView().down('#cntRcois').add({
            xtype   : 'cntRcois',
            mode    : 'add',
            count   : me.getRcoiCount() 
        })
    },
    btnDelRcoi: function(btn){
        var me      = this;
        btn.up('cntRcois').destroy();
    },
    addCellNetwork: function(btn){
        var me      = this;
        me.setCellNetworkCount(me.getCellNetworkCount()+1);
        me.getView().down('#cntCellNetworks').add({
            xtype   : 'cntCellNetworks',
            mode    : 'add',
            count   : me.getCellNetworkCount() 
        })
    },
    btnDelCellNetwork: function(btn){
        var me      = this;
        btn.up('cntCellNetworks').destroy();
    },
    btnSave:function(button){
        var me          = this;
        var formPanel   = this.getView();
        //Checks passed fine...      
        formPanel.submit({
            clientValidation    : true,
            url                 : me.getUrlSave(),
            submitEmptyText     : false, // Set this in the form config
            success             : function(form, action) {
                me.getView().store.reload();
                if (formPanel.closable) {
                    formPanel.close();
                }
                Ext.ux.Toaster.msg(
                    i18n('sItems_modified'),
                    i18n('sItems_modified_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    },
});
