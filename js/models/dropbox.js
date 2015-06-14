/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'dropbox'], function(Backbone, Dropbox) {
    
    var Model = Backbone.Model.extend({
        
        defaults: {
            'dirName': 'looper-audio',
            'owner': null
        },
        
        prepare: function(cb) {
            cb = cb || function() {};
            var model = this;
            model.client.stat(model.get('dirName'), {}, function(error, dirStat) {
                if (error || dirStat.isRemoved) {
                    console.log(error);
                    if (error && error.status == 404 || dirStat.isRemoved) {
                        model.client.mkdir(model.get('dirName'), function(error, dirStat) {
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
        
        saveFileToDropbox: function(loop) {
            var model = this;
            var path = model.get('dirName') + '/' + loop.get('loopId') + '.' + loop.get('fileExtension');
            var data = loop.get('audioData');
            var dropboxURL = loop.get('dropboxURL');
            if (data) {
                if (dropboxURL) {
                    model.app.dispatcher.trigger('add-status-message', {message: loop.get('name') + ' was already found in your Dropbox.', timeout: true});
                } else {
                    model.client.writeFile(path, data, {}, function(error, fileStat) {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        model.app.dispatcher.trigger('file-saved', {stat: fileStat, loop: loop});
                        model.app.dispatcher.trigger('add-status-message', {message: loop.get('name') + ' saved to Dropbox.', timeout: true});
                        model.getShareURL(path, loop);
                    });
                }
            }
        },
        
        getShareURL: function(path, loop) {
            var model = this;
            model.client.makeUrl(path, {downloadHack: true}, function(error, shareURL) {
                if (error) {
                    console.log(error);
                    return;
                }
                if (loop) {
                    loop.set('dropboxURL', shareURL.url);
                }
            });
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
