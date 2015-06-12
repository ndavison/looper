/**
 *
 *
 *
 *
 */

define(['backbone', 'dropbox'], function(Backbone, Dropox) {
    
    var Model = Backbone.Model.extend({
        
        getAccountInfo: function(cb) {
            cb = cb || function() {};
            this.client.getAccountInfo(function(error, info) {
                if (error) {
                    console.log(error);
                    return;
                }
                cb(info);
            });
        },
        
        auth: function(clientOptions, cb) {
            var model = this;
            clientOptions = clientOptions || {};
            cb = cb || function() {};
            model.client.authenticate(clientOptions, function(error, client) {
                if (error) {
                    console.log(error);
                    return;
                }
                if (model.client.isAuthenticated()) {
                    model.app.dispatcher.trigger('signed-in', model);
                } else {
                    model.app.dispatcher.trigger('signed-out', model);
                }
                cb(model);
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
        
        initialize: function() {
            var model = this;
            model.client = new Dropbox.Client({key: model.attributes.key});
            model.client.authDriver(new Dropbox.AuthDriver.Popup(
                {receiverUrl: model.attributes.receiverURL})
            );
        }
        
    });
    
    return Model;
    
}); 
