Ext.define('Rd.view.aps.vcApViewLink', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.vcApViewLink',
    
    showCard: function(cardId) {
        const holder = this.lookup('pnlCardHolder') || this.getView().down('#pnlCardHolder');
        const card = holder.down('#' + cardId);
        holder.getLayout().setActiveItem(card);
    },

    onInternetClick: function() {
        this.showCard('cardInternet');
    },

    onApClick: function() {
        this.showCard('cardAccessPoint');
    },

    onClientsClick: function() {
        this.showCard('cardClients');
    }
});
