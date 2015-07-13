/**
 *
 *
 *
 *
 */

define(['backbone', 'rsvp', 'dropbox'], function(Backbone, RSVP, Dropbox) {

    "use strict";
    
    var Model = Backbone.Model.extend({
                
        dirExists: function(dir) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.stat(dir, {}, function(error, dirStat) {
                    if (error || dirStat.isRemoved) {
                        if (error && error.status == 404 || dirStat.isRemoved) {
                            resolve(false);
                        } else {
                            reject(Error(error));
                        }
                    } else {
                        resolve(true);
                    }
                });
            });
        },
        
        makeDir: function(dir) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.mkdir(dir, function(error, dirStat) {
                    if (error) {
                        reject(Error(error));
                    }
                    resolve(dirStat);
                });
            });
        },
                        
        saveFileToDropbox: function(fileName, data) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.writeFile(fileName, data, {}, function(error, fileStat) {
                    if (error) {
                        reject(Error(error));
                    }
                    resolve(fileStat);
                });
            });
        },
        
        getShareURL: function(path) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.makeUrl(path, {downloadHack: true}, function(error, shareURL) {
                    if (error) {
                        reject(Error(error));
                    }
                    resolve(shareURL);
                });
            });
        },
        
        getAccountInfo: function() {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.getAccountInfo(function(error, info) {
                    if (error) {
                        reject(Error(error));
                    }
                    resolve(info);
                });
            });
        },
        
        auth: function(clientOptions) {
            var model = this;
            clientOptions = clientOptions || {};
            return new RSVP.Promise(function(resolve, reject) {
                model.client.authenticate(clientOptions, function(error, client) {
                    if (error) {
                        reject(Error(error));
                    }
                    if (model.client.isAuthenticated()) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        },
        
        signOut: function() {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.client.signOut(function(error) {
                    if (error) {
                        reject(Error(error));
                    }
                    resolve(true);
                });
            });
        },
        
        isAuthenticated: function() {
            return this.client.isAuthenticated();
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
