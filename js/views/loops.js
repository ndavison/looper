/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone', 'rsvp', 'models/looper', 'models/loop'], function(Backbone, RSVP, Looper, Loop) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        events: {
            'click input[name=looper-url]': 'handleShareURLClick',
            'click button.loop-button': 'handleLoopButtonClick',
            'touchstart button.loop-button': 'handleLoopButtonClick',
            'submit form#save-loops-form': 'saveFormSubmit',
            'input input[name=looper-name]': 'handleLooperNameInput'
        },
        
        addLoopButton: function(loopInfo) {
            var view = this;
            return new RSVP.Promise(function(resolve, reject) {
                return view.getTemplate('/looper/views/playloop.html', {loopFileId: loopInfo.loopFileId, name: loopInfo.name, enabled: loopInfo.isReady ? true : false})
                .then(function(res) {
                    return view.show(res, view.$el.find('div#loops-buttons'), true);
                }).then(function(loopEl) {
                    resolve(loopEl);
                }).catch(function(error) {
                    reject(Error(error));
                }); 
            });
        },
                
        enableLoopButton: function(loopFileId) {
            var view = this;
            if (loopFileId) {
                if (view.$el.find('button[data-loopfileid=' + loopFileId + ']').length > 0) {
                    var el = view.$el.find('button[data-loopfileid=' + loopFileId + ']');
                    el.removeAttr('disabled');
                }
            }
        },
        
        removeAllLoops: function() {
            this.stopLoops();
            this.$el.find('button.loop-button').remove();
        },
        
        addSaveForm: function() {
            var view = this;
            if (view.app.mode == 'create' && view.model.get('loops').length > 0 && view.$el.find('div#loops-saveform form').length == 0) {
                view.getTemplate('/looper/views/saveloops.html', {authenticated: view.app.models.dropBox.isAuthenticated()})
                    .then(function(res) {
                        return view.show(res, view.$el.find('div#loops-saveform'), false);
                    }).catch(function(error) {
                        console.log(error);
                    });
            }
        },
        
        removeSaveForm: function() {
            if (this.$el.find('div#loops-saveform form').length > 0) {
                this.$el.find('div#loops-saveform form').remove();
            }
        },
        
        addShareURLForm: function(url) {
            var self = this;
            return self.getTemplate('/looper/views/shareurl.html', {url: url})
                .then(function(res) {
                    return self.show(res, self.$el.find('div#looper-copyform'), false);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        
        removeShareURLForm: function() {
            if (this.$el.find('div#looper-copyform form').length > 0) {
                this.$el.find('div#looper-copyform form').remove();
            }
        },
        
        handleShareURLClick: function(ev) {
            ev.preventDefault();
            var el = ev.currentTarget;
            el.focus();
            el.setSelectionRange(0, el.value.length);
        },
        
        handleLoopButtonClick: function(ev) {
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
                    if (loop.audio) {
                        loop.audio.stop();
                    }
                }
            });
        },
        
        saveFormSubmit: function(ev) {
            ev.preventDefault();
            this.saveLoops();
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
                            view.app.dispatcher.trigger('status', '"' + fileName + '" is already available from Dropbox...');
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
                    view.app.dispatcher.trigger('looper-saved', view.model);
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
        
        handleLooperNameInput: function() {
            var name = this.$el.find('input[name=looper-name]').val();
            if (name) {
                this.model.set('name', name);
            }
        },
        
        loadLoops: function(loops) {
            var self = this;
            
            var promises = []
            for (var i = 0; i < loops.length; i++) {
                loops[i].loopFileId = loops[i].loopFileId || self.model.generateId();
                var buttonInfo = {
                    loopFileId: loops[i].loopFileId,
                    name: loops[i].name,
                    isReady: false
                };
                promises.push(self.addLoopButton(buttonInfo));
            }
            
            return RSVP.all(promises)
                .then(function() {
                    return self.model.populateLoops(loops);
                })
                .then(function() {
                    var loops = self.model.get('loops').models;
                    for (var i = 0; i < loops.length; i++) {
                        self.enableLoopButton(loops[i].get('loopFileId'));
                        loops[i].audio.setVolume(self.app.views.controls.getVolume());
                        loops[i].audio.setPitch(self.app.views.controls.getPitch());
                        self.app.dispatcher.trigger('loop-loaded', loops[i]);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        
        loadLooperFromId: function(id) {
            var self = this;
            if (id) {
                self.model.set('_id', id);
                self.model.fetchWithPromise({})
                    .then(function() {
                        return self.loadLoops(self.model.get('loops'));
                    })
                    .then(function() {
                        self.app.dispatcher.trigger('looper-loaded', self.model);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        
        setLooper: function(looper) {
            var self = this;
            if (looper) {
                self.removeAllLoops();
                self.removeSaveForm();
                self.removeShareURLForm();
                self.loadLooperFromId(looper.get('_id'));
            }
        },
        
        onAuthChange: function() {
            this.removeSaveForm();
            this.addSaveForm();
        },
        
        onMenuChange: function(mode) {
            if (mode == 'create') {
                this.addSaveForm();
            } else if (mode == 'find') {
                this.removeSaveForm();
                this.removeShareURLForm();
            }
        },
        
        onLoopFileRead: function(params) {
            this.loadLoops([params])
                .catch(function(error) {
                    console.log(error);
                });
        },
        
        onLooperNavigated: function(url) {
            this.addShareURLForm(url);
            this.removeSaveForm();
        },
                
        initialize: function() {
            this.model = new Looper();
            var dispatcher = this.app.dispatcher;
            dispatcher.on('signed-out', this.onAuthChange, this);
            dispatcher.on('signed-in', this.onAuthChange, this);
            dispatcher.on('menu-change', this.onMenuChange, this);
            dispatcher.on('looper-selected', this.setLooper, this);
            dispatcher.on('looper-navigated', this.onLooperNavigated, this);
            dispatcher.on('file-read', this.onLoopFileRead, this);
            dispatcher.on('loop-loaded', this.addSaveForm, this);
            dispatcher.on('change-volume', this.changeVolumes, this);
            dispatcher.on('change-pitch', this.changePitches, this);
            dispatcher.on('signed-in-user-info', this.setUserId, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 