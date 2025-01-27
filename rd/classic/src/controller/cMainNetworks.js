Ext.define('Rd.controller.cMainNetworks', {
    extend: 'Ext.app.Controller',
    config: {
        urlGetContent : '/cake4/rd_cake/dashboard/items-for.json'
    },
    actionIndex: function(pnl,itemId){
        var me      = this;
        var item    = pnl.down('#'+itemId);
        var added   = false;
        if(!item){
            var tp = Ext.create('Ext.tab.Panel',
            	{          
	            	border  : false,
	                itemId  : itemId,
	                plain	: true,
	                cls     : 'subSubTab', //Make darker
	            });      
            pnl.add(tp);
            Ext.Ajax.request({
                url     : me.getUrlGetContent(),
                method  : 'GET',
                params  : { item_id : itemId },
                success : function (response) {
                    var jsonData = Ext.JSON.decode(response.responseText);
                    if (jsonData.success) {
                        var items = jsonData.items;
                        if(items.meshes){
                            Ext.getApplication().runAction('cMeshes','Index',tp); 
                            added = true;                      
                        }
                        if(items.ap_profiles){
                            Ext.getApplication().runAction('cAccessPoints','Index',tp);
                            added = true;
                        }
                        if(items.unknown_nodes){
                            Ext.getApplication().runAction('cUnknownNodes','Index',tp);
                            added = true;
                        }
                        //tp.add(items);
                    }
                },
                scope: me
            });
            added = true;
        }
        return added;      
    }
});
