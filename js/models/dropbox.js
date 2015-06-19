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
            model.prepare(function () {
                var path = model.get('dirName') + '/' + loop.get('loopId') + '.' + loop.get('fileExtension');
                var data = loop.getAudioProperties().audioData;
                var dropboxURL = loop.get('dropboxURL');
                if (data) {
                    if (dropboxURL) {
                        model.trigger('status', loop.get('name') + ' was already found in your Dropbox.');
                    } else {
                        model.client.writeFile(path, data, {}, function(error, fileStat) {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            model.trigger('file-saved', {stat: fileStat, loop: loop});
                            model.trigger('status', loop.get('name') + ' saved to Dropbox.');
                            model.getShareURL(path, function(url) {
                                model.trigger('shareurl-created', {shareURL: url, loop: loop});
                            });
                        });
                    }
                }
            });
        },
        
        getShareURL: function(path, cb) {
            var model = this;
            cb = cb || function () {};
            model.client.makeUrl(path, {downloadHack: true}, function(error, shareURL) {
                if (error) {
                    console.log(error);
                    return;
                }
                cb(shareURL.url);
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
                    model.trigger('signed-in', model);
                    model.getAccountInfo(function(info) {
                        model.set('owner', info.uid);
                        model.trigger('signed-in-user-info', info);
                    });
                } else {
                    model.trigger('signed-out', model);
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
                model.trigger('signed-out', model);
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
