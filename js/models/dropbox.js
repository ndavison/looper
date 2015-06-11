/**
 *
 *
 *
 *
 */

define(['backbone', 'dropbox'], function(Backbone, Dropox) {
    
    var Model = Backbone.Model.extend({
        
        getUserInfo: function(cb) {
            cb = cb || function() {};
            this.client.getAccountInfo(function(error, info) {
                if (error) {
                    console.log(error);
                    return;
                }
                cb(info);
            });
        },
        
        auth: function(cb) {
            var model = this;
            cb = cb || function() {};
            model.client = new Dropbox.Client({key: model.attributes.key});
            model.client.authDriver(new Dropbox.AuthDriver.Popup(
                {receiverUrl: model.attributes.receiverURL})
            );
            model.client.authenticate(function(error, client) {
                if (error) {
                    console.log(error);
                    return;
                }
                model.app.dispatcher.trigger('signed-in', model);
                cb(model);
                return;
            });
        },
        
        signOut: function(cb) {
            var model = this;
            cb = cb || function() {};
            model.client.signOut(function(error) {
                if (error) {
                    console.log(error);
                    return;
                }
                model.app.dispatcher.trigger('signed-out', model);
                cb(model);
            });
        },
        
        initialize: function() {}
        
    });
    
    return Model;
    
}); 
