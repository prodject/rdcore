// app/view/wireguard/vcWireguardLiveEvents.js
Ext.define('Rd.view.wireguard.vcWireguardLiveEvents', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcWireguardLiveEvents',

    config: {
        serverId     : null,   // set by the grid config
        running      : false,
        task         : null,
        maxRows      : 500,    // cap the buffer
        tickMs       : 1000,   // how often to inject events
        burstMin     : 0,      // how many events per tick
        burstMax     : 3
    },

    // lifecycle
    init: function(){
        const v = this.getView();
        if (Ext.isNumber(v.serverId)) this.setServerId(v.serverId);
        v.on('activate', this.startLive, this, { single: true });
        v.on('destroy',  this.stopLive,  this);
    },

    setServerId: function(id){
        this.setConfig({ serverId: id });
        const st = this.getView().getStore();
        st.clearFilter();
        if (Ext.isNumber(id)) {
            st.addFilter({ property: 'server_id', value: id });
        }
    },

    startLive: function(){
        if (this.getRunning()) return;
        const runner = Ext.create('Ext.util.TaskRunner') ;
        const task   = runner.start({
            run   : this.injectBurst,
            scope : this,
            interval: this.getTickMs()
        });
        this.setTask(task);
        this.setRunning(true);
    },

    stopLive: function(){
        const task = this.getTask();
        if (task && task.stop) task.stop();
        this.setTask(null);
        this.setRunning(false);
    },

    injectBurst: function(){
        const st     = this.getView().getStore();
        const burstN = Ext.Number.randomInt(this.getBurstMin(), this.getBurstMax());
        const items  = [];
        for (let i=0; i<burstN; i++){
            items.push(this.generateEvent());
        }
        if (items.length){
            st.add(items);
            // Trim to maxRows (since sorted DESC by ts)
            const extra = st.getCount() - this.getMaxRows();
            if (extra > 0){
                // remove from the end (oldest)
                const toRemove = [];
                for (let j=st.getCount()-1; j>=st.getCount()-extra; j--){
                    toRemove.push(st.getAt(j));
                }
                st.remove(toRemove);
            }
        }
    },

    // ---- Fake data helpers ----
    generateEvent: function(){
        const serverId   = this.getServerId() ?? Ext.Number.randomInt(1, 4);
        const iface      = this.pick(['wg0','wg1','wg2','wg3']);
        const event      = this.pick(['connected','disconnected','appeared','updated']);
        const publicKey  = this.randomPublicKey();
        const endpoint   = `${this.randomIPv4()}:${Ext.Number.randomInt(1024, 65535)}`;
        return {
            id         : Ext.id(null, 'wgevt-'),
            server_id  : serverId,
            ts         : new Date(),
            event      : event,
            iface      : iface,
            public_key : publicKey,
            endpoint   : endpoint
        };
    },

    pick: function(arr){ return arr[Ext.Number.randomInt(0, arr.length-1)]; },

    randomIPv4: function(){
        return [
            Ext.Number.randomInt(1, 223),
            Ext.Number.randomInt(0, 255),
            Ext.Number.randomInt(0, 255),
            Ext.Number.randomInt(1, 254)
        ].join('.');
    },

    randomPublicKey: function(){
        // 44-ish chars base64-looking for WireGuard-ish vibes
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let s = '';
        for (let i=0;i<44;i++) s += alphabet.charAt(Ext.Number.randomInt(0, alphabet.length-1));
        return s + '=';
    },

    // Optional: wire up to your existing toolbar if it emits events
    // You can call these from button handlers:
    onStartClick: function(){ this.startLive(); },
    onStopClick : function(){ this.stopLive();  },

    // If you implement a time-span filter (e.g. last X minutes),
    // call this to filter by age in seconds:
    filterByAgeSeconds: function(maxAge){
        const st = this.getView().getStore();
        st.clearFilter(true);
        if (Ext.isNumber(this.getServerId())){
            st.addFilter({ property:'server_id', value:this.getServerId() });
        }
        if (Ext.isNumber(maxAge)){
            const now = Date.now();
            st.addFilter({
                filterFn: rec => ((now - rec.get('ts'))/1000) <= maxAge
            });
        }
    }
});
