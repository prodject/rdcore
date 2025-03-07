Ext.define('Rd.view.passpoint.vcPasspointAddEdit', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcPasspointAddEdit',
    init    : function() {
    
    },
    config: {
        urlAdd          : '/cake4/rd_cake/passpoint-profiles/add.json',
        urlEdit         : '/cake4/rd_cake/passpoint-profiles/edit.json',
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
            addCellNetwork  : 'addCellNetwork',
            //afterrender     : 'pnlAfterRender'
            activate        : 'pnlActive'
        },
        '#save': {
            click   : 'btnSave'
        },
        'pnlPasspointAddEdit #btnEasy' : {
            click   : 'btnEasy'
        },
        'pnlPasspointAddEdit #btnCustom' : {
            click   : 'btnCustom'
        }
    },
    pnlAfterRender : function(){
        var me = this;
        var profile_id = me.getView().passpoint_profile_id;
        console.log("After Render "+profile_id);    
    },
    pnlActive   : function(form){
        var me          = this; 
        var profile_id  = me.getView().passpoint_profile_id;

        if(profile_id == 0){
            return; //add - no need to load
        } 
        
        me.getView().down('#cntDomains').removeAll(true);
        me.getView().down('#cntNaiRealms').removeAll(true);  
        me.getView().down('#cntRcois').removeAll(true);  
        me.getView().down('#cntCellNetworks').removeAll(true);    
        form.load({
            url         : me.getUrlView(), 
            method      : 'GET',
            params      : { profile_id: profile_id },
            success     : function(a,b,c){        
                if(b.result.data.passpoint_domains){
            	    Ext.Array.forEach(b.result.data.passpoint_domains,function(domain,index){
            	         me.getView().down('#cntDomains').add({
                            xtype   : 'cntPasspointDomains',
                            mode    : 'edit',
                            d_name  : domain.name,
                            count   : domain.id
                        });            	    
            	    })	            			
            	}
            	
            	if(b.result.data.passpoint_nai_realms){
            	    Ext.Array.forEach(b.result.data.passpoint_nai_realms,function(nai,index){
            	         me.getView().down('#cntNaiRealms').add({
                            xtype       : 'cntNaiRealms',
                            mode        : 'edit',
                            nai_name    : nai.name,
                            eap_methods : nai.eap_methods,
                            count       : nai.id
                        });            	    
            	    })	            			
            	}
            	
            	if(b.result.data.passpoint_rcois){
            	    Ext.Array.forEach(b.result.data.passpoint_rcois,function(rcoi,index){
            	         me.getView().down('#cntRcois').add({
                            xtype       : 'cntRcois',
                            mode        : 'edit',
                            rcoi_name   : rcoi.name,
                            rcoi_id     : rcoi.rcoi_id,
                            count       : rcoi.id
                        });            	    
            	    })	            			
            	}
            	
            	if(b.result.data.passpoint_cell_networks){
            	    Ext.Array.forEach(b.result.data.passpoint_cell_networks,function(cell,index){
            	         me.getView().down('#cntCellNetworks').add({
                            xtype       : 'cntCellNetworks',
                            mode        : 'edit',
                            cell_name   : cell.name,
                            cell_mcc    : cell.mcc,
                            cell_mnc    : cell.mnc,
                            count       : cell.id
                        });            	    
            	    })	            			
            	}
            	
            	me.warningCheck(); //Lastly                       
            }
        });          
    },
    warningCheck : function(){
        var me = this;
        var txtTest = me.getView().down('#cntServiceProviders').down('textfield');
        if(txtTest){
            me.getView().down('#cntServiceProviders').down('#lblWarn').hide();
        }else{
            me.getView().down('#cntServiceProviders').down('#lblWarn').show();
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
        me.warningCheck();
    },
    btnDelDomain: function(btn){
        var me      = this;      
        btn.up('cntPasspointDomains').destroy();
        me.warningCheck();
    },
    addNaiRealm: function(btn){
        var me      = this;
        me.setNaiRealmCount(me.getNaiRealmCount()+1);
        me.getView().down('#cntNaiRealms').add({
            xtype   : 'cntNaiRealms',
            mode    : 'add',
            count   : me.getNaiRealmCount() 
        })
        me.warningCheck();
    },
    btnDelNaiRealm: function(btn){
        var me      = this;
        btn.up('cntNaiRealms').destroy();
        me.warningCheck();
    },
    addRcoi: function(btn){
        var me      = this;
        me.setRcoiCount(me.getRcoiCount()+1);
        me.getView().down('#cntRcois').add({
            xtype   : 'cntRcois',
            mode    : 'add',
            count   : me.getRcoiCount() 
        })
        me.warningCheck();
    },
    btnDelRcoi: function(btn){
        var me      = this;
        btn.up('cntRcois').destroy();
        me.warningCheck();
    },
    addCellNetwork: function(btn){
        var me      = this;
        me.setCellNetworkCount(me.getCellNetworkCount()+1);
        me.getView().down('#cntCellNetworks').add({
            xtype   : 'cntCellNetworks',
            mode    : 'add',
            count   : me.getCellNetworkCount() 
        })
        me.warningCheck();
    },
    btnDelCellNetwork: function(btn){
        var me      = this;
        btn.up('cntCellNetworks').destroy();
        me.warningCheck();
    },
    btnSave:function(button){
        var me          = this;
        var formPanel   = this.getView();
        
        var url         = me.getUrlEdit();
        if(me.getView().passpoint_profile_id == 0){
            url = me.getUrlAdd();   
        }
             
        //Checks passed fine...      
        formPanel.submit({
            clientValidation    : true,
            url                 : url,
            submitEmptyText     : false, // Set this in the form config
            success             : function(form, action) {
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
    btnEasy : function(){
        var me = this;
        Ext.Array.forEach(me.getView().customFields,function(itemId,index){
            me.getView().down('#'+itemId).hide();
            me.getView().down('#'+itemId).disable();     
        });
        
    },
    btnCustom : function(){
        var me = this;
        Ext.Array.forEach(me.getView().customFields,function(itemId,index){
            me.getView().down('#'+itemId).show();
            me.getView().down('#'+itemId).enable();
        });     
    } 
});
