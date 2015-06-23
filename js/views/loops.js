/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone', 'rsvp', 'models/looper', 'models/loops'], function(Backbone, RSVP, Looper, Loops) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        events: {
            'click button': 'playLoop',
            'touchstart button': 'playLoop',
            'click button#save-loops': 'saveLoops',
            'input input[name=looper-name]': 'setLooperName'
        },
        
        addLoopButton: function(loop) {
            var view = this;
            view.getTemplate('/looper/views/playloop.html', {loopFileId: loop.get('loopFileId'), name: loop.get('name'), enabled: false})
                .then(function(res) {
                    view.addSaveForm();
                    return view.show(res, view.$el.find('div#loops-buttons'), true);
                }).catch(function(error) {
                    console.log(error);
                });
        },
                
        enableLoopButton: function(loop) {
            var view = this;
            var loopFileId = loop.get('loopFileId');
            if (loopFileId) {
                if (view.$el.find('button[data-loopfileid=' + loopFileId + ']').length > 0) {
                    var el = view.$el.find('button[data-loopfileid=' + loopFileId + ']');
                    el.removeAttr('disabled');
                }
            }
        },
        
        addSaveForm: function() {
            var view = this;
            if (view.$el.find('form#view-saveform').length == 0) {
                view.getTemplate('/looper/views/saveloops.html', {}).then(function(res) {
                    return view.show(res, view.$el.find('div#loops-saveform'), false);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        },
        
        playLoop: function(ev) {
            ev.preventDefault();
            var target = ev.currentTarget;
            var loopFileId = $(target).attr('data-loopfileid');
            var loop = this.model.get('loops').findWhere({loopFileId: loopFileId});
            if (loop) {
                this.stopLoops();
                loop.audio.play();
            }
        },
        
        stopLoops: function(exceptThisLoop) {
            var view = this;
            view.model.get('loops').forEach(function(loop) {
                if (exceptThisLoop && exceptThisLoop.get('loopFileId') != loop.get('loopFileId') || !exceptThisLoop) {
                    loop.audio.stop();
                }
            });
        },
        
        saveLoops: function() {
            var view = this;
            var dropBoxDir = view.app.config.dropBoxDir;
            
            view.app.models.dropBox.dirExists(dropBoxDir)
                .then(function(exists) {
                    view.app.dispatcher.trigger('status', 'Preparing your Dropbox...');
                    return exists ? null : view.app.models.dropBox.makeDir(dropBoxDir);                    
                })
                .then(function() { 
                    var promises = [];
                    for (var i = 0; i < view.model.get('loops').models.length; i++) {
                        var loop = view.model.get('loops').models[i];
                        var fileName = loop.get('loopFileId') + '.' + loop.get('fileExtension');
                        if (loop.get('dropboxURL')) {
                            view.app.dispatcher.trigger('status', '"' + fileName + '" already found in your Dropbox...');
                        } else {
                            var data = loop.dataURItoBlob(loop.audio.get('src'));
                            if (data) {
                                view.app.dispatcher.trigger('status', 'Saving "' + loop.get('name') + '" to Dropbox...');
                                promises.push(view.app.models.dropBox.saveFileToDropbox(dropBoxDir + '/' + fileName, data));
                            }
                        }
                    }
                    return RSVP.all(promises);
                })
                .then(function(fileStats) {
                    if (fileStats.length > 0) {
                        var promises = _.map(fileStats, function(fileStat) {
                            return view.app.models.dropBox.getShareURL(fileStat.path);
                        });
                        view.app.dispatcher.trigger('status', 'Getting URLs for the uploaded files...');
                        return RSVP.all(promises);
                    }
                })
                .then(function(shareURLs) {
                    if (shareURLs) {
                        for (var i = 0; i < shareURLs.length; i++) {
                            var url = shareURLs[i].url;
                            var urlMatches = url.match(/.*\/([^\.]+)\./);
                            if (urlMatches && urlMatches[1]) {
                                var loopFileId = urlMatches[1];
                                var loop = view.model.get('loops').findWhere({loopFileId: loopFileId});
                                loop.set('dropboxURL', url);
                            }
                        }
                    }
                })
                .then(function() {
                    view.app.dispatcher.trigger('status', 'Saving your Looper metadata to our servers...');
                    return view.model.saveWithPromise();
                })
                .then(function() {
                    view.app.dispatcher.trigger('status', 'Done!');
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        
        changeVolumes: function(level) {
            this.model.get('loops').forEach(function(loop) {
                loop.audio.setVolume(level);
            });
        },
        
        changePitches: function(level) {
            this.model.get('loops').forEach(function(loop) {
                loop.audio.setPitch(level);
            });
        },
        
        setUserId: function(info) {
            if (info.uid) {
                this.model.set('userId', info.uid);
            }
        },
        
        setLooperName: function() {
            var name = this.$el.find('input[name=looper-name]').val();
            if (name) {
                this.model.set('name', name);
            }
        },
        
        addLoopToCollection: function(loop) {
            this.model.get('loops').add(loop);
        },
                
        initialize: function() {
            this.model = new Looper({loops: new Loops()});
            var dispatcher = this.app.dispatcher;
            dispatcher.on('loop-loaded', this.enableLoopButton, this);
            dispatcher.on('loop-added', this.addLoopToCollection, this);
            dispatcher.on('loop-added', this.addLoopButton, this);
            dispatcher.on('save-loops', this.saveLoops, this);
            dispatcher.on('change-volume', this.changeVolumes, this);
            dispatcher.on('change-pitch', this.changePitches, this);
            dispatcher.on('signed-in-user-info', this.setUserId, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 