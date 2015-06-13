/**
 *
 *
 *
 *
 */

define(['backbone', 'dropbox'], function(Backbone, Dropox) {
    
    var Model = Backbone.Model.extend({
        
        defaults: {
            'dropboxURL': null,
            'owner': null
        },
        
        prepare: function(options) {
            cb = options.callback || function() {};
            var model = this;
            model.client.stat(options.dirName, {}, function(error, dirStat) {
                if (error || dirStat.isRemoved) {
                    console.log(error);
                    if (error && error.status == 404 || dirStat.isRemoved) {
                        model.client.mkdir(options.dirName, function(error, dirStat) {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            cb();
                        });
                    } else {
                        return;
                    }
                } else {
                    cb();
                }
            });
        },
        
        saveFileToDropbox: function(file) {
            var model = this;
            if (file.data && file.path) {
                model.client.writeFile(file.path, file.data, {}, function(error, fileStat) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    model.app.dispatcher.trigger('file-saved', fileStat);
                });
            }
        },
        
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
                    model.getAccountInfo(function(info) {
                        model.set('owner', info.uid);
                    });
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
            model.app.dispatcher.on('dropbox-prepare', model.prepare, model);
            model.app.dispatcher.on('save-loop', model.saveFileToDropbox, model);
            model.client = new Dropbox.Client({key: model.attributes.key});
            model.client.authDriver(new Dropbox.AuthDriver.Popup(
                {receiverUrl: model.attributes.receiverURL})
            );
        }
        
    });
    
    return Model;
    
}); 
