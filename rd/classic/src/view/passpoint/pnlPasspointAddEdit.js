Ext.define('Rd.view.passpoint.pnlPasspointAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlPasspointAddEdit',
    autoScroll	: true,
    plain       : true,
    frame       : false,
    listeners       : {
     //   activate  : 'onViewActivate'
    },
    layout      : {
        type    : 'vbox',
        pack    : 'start',
        align   : 'stretch'
    },
    margin      : 5,  
    fieldDefaults: {
        msgTarget       : 'under',
        labelAlign      : 'left',
        labelSeparator  : '',
        labelWidth      : Rd.config.labelWidth+20,
        margin          : Rd.config.fieldMargin,
        labelClsExtra   : 'lblRdReq'
    },
    buttons : [
        {
            itemId  : 'save',
            text    : 'SAVE',
            scale   : 'large',
            formBind: true,
            glyph   : Rd.config.icnYes,
            margin  : Rd.config.buttonMargin,
            ui      : 'button-teal'
        }
    ],
    requires    : [
        'Rd.view.passpoint.vcPasspointAddEdit',
        'Rd.view.passpoint.tagEapMethods',
        'Rd.view.passpoint.cmbVenueTypes',
        'Rd.view.passpoint.cmbNetworkTypes',
        'Rd.view.passpoint.cntPasspointDomains',
        'Rd.view.passpoint.cntNaiRealms',
        'Rd.view.passpoint.cntRcois',
        'Rd.view.passpoint.cntCellNetworks'
    ],
    controller  : 'vcPasspointAddEdit',
    initComponent: function(){
        var me          = this;
        var w_prim      = 550;          
        var cntHotspot  = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [ 
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Venue Name',
                    name        : 'name',
                    allowBlank  : false
                },
                {           
                    xtype       : 'cmbVenueTypes'
                },
                {           
                    xtype       : 'cmbNetworkTypes'
                }
            ]
        };
        
        var cntServiceProviders = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype   : 'label',
                    html    : '<h4>DOMAIN LIST</h4>',
                },
                               
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntDomains'   
                },
                {
                    xtype: 'component',
                    html: '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style: 'text-align: left; display: block; margin-left:10px;',  // Right-aligns the link
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on('click', function (e) {
                                e.preventDefault(); // Prevent default link behavior
                                me.fireEvent('addDomain');
                            });
                        }
                    }
                },
                
                {
                    xtype   : 'label',
                    html    : '<h4>NAI REALMS</h4>',
                },                
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntNaiRealms'   
                },
                {
                    xtype: 'component',
                    html: '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style: 'text-align: left; display: block; margin-left:10px;',  // Right-aligns the link
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on('click', function (e) {
                                e.preventDefault(); // Prevent default link behavior
                                me.fireEvent('addNaiRealm');
                            });
                        }
                    }
                },
                
                {
                    xtype   : 'label',
                    html    : '<h4>RCOI LIST</h4>',
                },
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntRcois'   
                },
                {
                    xtype: 'component',
                    html: '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style: 'text-align: left; display: block; margin-left:10px;',  // Right-aligns the link
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on('click', function (e) {
                                e.preventDefault(); // Prevent default link behavior
                                me.fireEvent('addRcoi');
                            });
                        }
                    }
                },
                
                {
                    xtype   : 'label',
                    html    : '<h4>3GPP CELLULAR NETWORK</h4>',
                },
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntCellNetworks'   
                },
                {
                    xtype: 'component',
                    html: '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style: 'text-align: left; display: block; margin-left:10px;',  // Right-aligns the link
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on('click', function (e) {
                                e.preventDefault(); // Prevent default link behavior
                                me.fireEvent('addCellNetwork');
                            });
                        }
                    }
                },
                
               /* {
                    xtype   : 'container',
                    layout  : 'hbox',
                    margin  : 0,
                    items   : [
                        {
                            xtype       : 'textfield',
                            emptyText   : 'Realm',
                            name        : 'nai_realm_0',
                            margin      : 10,
                        },  
                        {
                            xtype       : 'tagEapMethods',
                            width       : 290,
                            margin      : 10,
                        },
                        {   
                            xtype       : 'button',
                            margin      : '10 0 0 0',
                            glyph       : Rd.config.icnAdd
                        }                      
                    ]
                },                               
                {
                    xtype   : 'label',
                    html    : '<h4>RCOI LIST</h4>',
                },
                {
                    xtype   : 'container',
                    layout  : 'hbox',
                    margin  : 0,
                    items   : [
                        {
                            xtype       : 'textfield',
                            emptyText   : 'Name',
                            name        : 'rcoi_name_0',
                            margin      : 10,
                        },
                        {
                            xtype       : 'textfield',
                            emptyText   : 'Organization ID (RCIO)',
                            name        : 'rcoi_name_0',
                            width       : 290,
                            margin      : 10,
                        }, 
                        {   
                            xtype       : 'button',
                            margin      : '10 0 0 0',
                            glyph       : Rd.config.icnAdd
                        }                      
                    ]
                },
                {
                    xtype   : 'label',
                    html    : '<h4>3GPP CELLULAR NETWORK</h4>',
                },
                {
                    xtype   : 'container',
                    layout  : 'hbox',
                    margin  : 0,
                    items   : [
                        {
                            xtype       : 'textfield',
                            emptyText   : 'Mobile Provider',
                            name        : 'anqp_3gpp_cell_net_0',
                            margin      : 10,
                        },
                        {
                            xtype       : 'numberfield',
                            name        : 'mcc0',
                            allowBlank  : true,
                            emptyText   : 'MCC',
                            maxValue    : 4094,
                            minValue    : 1,
                            hideTrigger : true,
                            keyNavEnabled  : false,
                            mouseWheelEnabled	: false,
                            margin      : 10,
                            width       : 135,
                        },   
                        {
                            xtype       : 'numberfield',
                            name        : 'mnc0',
                            allowBlank  : true,
                            emptyText   : 'MNC',
                            maxValue    : 4094,
                            minValue    : 1,
                            hideTrigger : true,
                            keyNavEnabled  : false,
                            mouseWheelEnabled	: false,
                            margin      : 10,
                            width       : 135,
                        }, 
                        {   
                            xtype       : 'button',
                            margin      : '10 0 0 0',
                            glyph       : Rd.config.icnAdd
                        }                      
                    ]
                },*/ 
                                            
            ]  
        };
        
        var cntNetwork = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Additional Step Required for Access',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'asra'          
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Emergency services reachable',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'esr'          
                }, 
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Unauthenticated emergency service accessible',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'uesa'          
                }, 
                
            ]  
        };
        
        var cntOsu = {
            xtype       : 'container',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
             
            ]  
        };
              
         me.items = [
            {
                xtype       : 'panel',
                title       : 'Hotspot Identification',
              //  glyph       : Rd.config.icnGears,  
                ui          : 'panel-green',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntHotspot				
            },
            {
                xtype       : 'panel',
                title       : 'Service Provider Information',
                ui          : 'panel-green',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntServiceProviders				
            },
            {
                xtype       : 'panel',
                title       : 'Network Capabilities', 
                ui          : 'panel-green',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntNetwork				
            },
            {
                xtype       : 'panel',
                title       : 'Online Sign-Up and Provisioning', 
                ui          : 'panel-green',
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                bodyPadding : 10,
                items       : cntOsu				
            }
        ];    
      
        me.callParent(arguments);
    }
});
