Ext.define('Rd.view.passpoint.pnlPasspointAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlPasspointAddEdit',
    autoScroll	: true,
    plain       : true,
    frame       : false,
    listeners       : {
      //  activate  : 'onViewActivate'
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
        var l_style     = 'color: #9d9d9d;font-stretch: expanded;font-weight:100;font-size:16px;';
        var plus_style  = 'text-align: left; display: block; margin:10px;margin-bottom:20px;';
                       
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
                    name        : 'id',
                    hidden      : true,
                    value	    : me.passpoint_profile_id
                },
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
            itemId      : 'cntServiceProviders',
            width       : w_prim,
            layout      : 'anchor',
            defaults    : {
                anchor  : '100%'
            },
            items       : [
                {
                    xtype   : 'label',
                    itemId  : 'lblWarn',
                    style   : 'color:#de9516;font-stretch: expanded;font-weight:100;font-size:12px;padding:20px;',
                    html    : '<br><i class="fa fa-sticky-note"></i> Specify at least one provider<br><br>',
                },          
                {
                    xtype   : 'label',
                    style   : l_style,
                    html    : 'DOMAIN LIST',
                },                               
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntDomains'   
                },
                {
                    xtype   : 'component',
                    html    : '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style   : plus_style,  // Right-aligns the link
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
                    style   : l_style,
                    html    : 'NAI REALMS',
                },                
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntNaiRealms'   
                },
                {
                    xtype   : 'component',
                    html    : '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style   : plus_style,  // Right-aligns the link
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
                    style   : l_style,
                    html    : 'RCOI LIST',
                },
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntRcois'   
                },
                {
                    xtype   : 'component',
                    html    : '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style   : plus_style,  // Right-aligns the link
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
                    style   : l_style,
                    html    : '3GPP CELLULAR NETWORK',
                },
                {
                    xtype   : 'container',
                    layout  : 'vbox',
                    itemId  : 'cntCellNetworks'   
                },
                {
                    xtype   : 'component',
                    html    : '<a href="#" class="form-link"><i class="fa fa-plus"></i>   Add</a>',
                    style   : plus_style,  // Right-aligns the link
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
                xtype       : 'container',             
                layout      : {
                  type  : 'vbox',
                  align : 'start',
                  pack  : 'start'
                },
                items       : [
                    {
                        xtype       : 'radiogroup',
                        width       : w_prim,
                        layout      : {
			                type	: 'hbox',
			                align	: 'middle',
			                pack	: 'stretchmax',
			                padding	: 0,
			                margin	: 0
		                },
                        defaultType : 'button',
				        defaults    : {
			                enableToggle    : true,
			                toggleGroup     : 'show_options',
			                allowDepress    : false,					
		                },             
                        items: [
			                { text: 'Easy Setup',   itemId: 'btnEasy',   glyph: Rd.config.icnPlay, flex:1, ui : 'default-toolbar', 'margin' : '0 5 0 0', pressed: true },
			                { text: 'Custom Setup', itemId: 'btnCustom', glyph: Rd.config.icnGears,   flex:1, ui : 'default-toolbar', 'margin' : '0 0 0 5', pressed: false},
		                ]
                    }
                ]
            },
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
                itemId      : 'pnlNetwork',
                hidden      : true,
                disabled    : true,
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
                itemId      : 'pnlSignup',
                hidden      : true,
                disabled    : true,
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
