Ext.define('Rd.view.passpoint.pnlPasspointAddEdit', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlPasspointAddEdit',
    autoScroll	: true,
    plain       : true,
    frame       : false,
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
    customFields : [
        'pnlNetwork',
        'pnlSignup',
        'idHessid',
        'idVenueUrl'
    ], 
    initComponent: function(){
        var me          = this;
        var w_prim      = 550; 
        var l_style     = 'color: #9d9d9d;font-stretch: expanded;font-weight:100;font-size:16px;';
        var plus_style  = 'text-align: left; display: block; margin:10px;margin-bottom:20px;';
               
        var ipv4_type = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":0, "name":'Address type not available'},
                {"id":1, "name":'Public IPv4 address available'},
                {"id":2, "name":'Port-restricted IPv4 address available'},
                {"id":3, "name":'Single NATed private IPv4 address available'},
                {"id":4, "name":'Double NATed private IPv4 address available'},
                {"id":5, "name":'Port-restricted IPv4 address and single NATed IPv4 address available'},
                {"id":6, "name":'Port-restricted IPv4 address and double NATed IPv4 address available'},
                {"id":7, "name":'Availability of the address type is not known'}
            ]
        });
        
        var ipv6_type = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data : [
                {"id":0, "name":'Address type not available'},
                {"id":1, "name":'Address type available'},
                {"id":2, "name":'Availability of the address type not known'}
            ]
        });
                       
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
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Venue URL',
                    itemId      : 'idVenueUrl',
                    hidden      : true,
                    disabled    : true,
                    name        : 'venue_url',
                    allowBlank  : true,
                    labelClsExtra: 'lblRd'                    
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'dot11HESSID',
                    itemId      : 'idHessid',
                    hidden      : true,
                    disabled    : true,
                    name        : 'hessid',
                    allowBlank  : true,
                    labelClsExtra: 'lblRd'                    
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
                }                                            
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
                    fieldLabel  : 'Network Availibility IPv4',
                    store       : ipv4_type,
                    name        : 'ipv4_type',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 3,
                    labelClsExtra : 'lblRd'
                },
                {
                    fieldLabel  : 'Network Availibility IPv6',
                    store       : ipv6_type,
                    name        : 'ipv6_type',
                    queryMode   : 'local',
                    displayField: 'name',
                    valueField  : 'id',
                    xtype       : 'combobox',
                    value       : 2,
                    labelClsExtra : 'lblRd'
                },            
                {
                    xtype       : 'label',
                    style       : l_style,
                    html        : 'NETWORK ACCESS',
                }, 
                {
                    xtype       : 'checkbox',      
                    boxLabel  	: 'Internet',
                    boxLabelCls	: 'boxLabelRd',
                    name        : 'internet',
                    checked     : true          
                },
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
