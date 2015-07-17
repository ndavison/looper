/**
 *
 *
 *
 *
 */
 
define(['backbone', 'rsvp', 'models/looper', 'models/loop'], function(Backbone, RSVP, Looper, Loop) {

    "use strict";
   
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
            var self = this;
            return new RSVP.Promise(function(resolve, reject) {
                return self.getTemplate('/looper/views/playloop.html', {loopFileId: loopInfo.loopFileId, name: loopInfo.name, enabled: loopInfo.isReady ? true : false})
                .then(function(res) {
                    return self.show(res, self.$('div#loops-buttons'), true);
                }).then(function(loopEl) {
                    resolve(loopEl);
                }).catch(function(error) {
                    reject(Error(error));
                }); 
            });
        },
                
        enableLoopButton: function(loopFileId) {
            var self = this;
            if (loopFileId) {
                if (self.$('button[data-loopfileid=' + loopFileId + ']').length > 0) {
                    var el = self.$('button[data-loopfileid=' + loopFileId + ']');
                    el.removeAttr('disabled');
                }
            }
        },
        
        removeAllLoops: function() {
            this.stopLoops();
            this.$('button.loop-button').remove();
        },
        
        addSaveForm: function() {
            var self = this;
            if (self.app.mode == 'create' && self.model.get('loops').length > 0 && self.$('div#loops-saveform form').length == 0) {
                self.getTemplate('/looper/views/saveloops.html', {authenticated: self.app.models.dropBox.isAuthenticated()})
                    .then(function(res) {
                        return self.show(res, self.$('div#loops-saveform'), false);
                    }).catch(function(error) {
                        self.app.views.alerts.createAlert('Failed to load the save looper form template.', 'danger');
                    });
            }
        },
        
        removeSaveForm: function() {
            if (this.$('div#loops-saveform form').length > 0) {
                this.$('div#loops-saveform form').remove();
            }
        },
        
        addShareURLForm: function(url) {
            var self = this;
            return self.getTemplate('/looper/views/shareurl.html', {url: url})
                .then(function(res) {
                    return self.show(res, self.$('div#looper-copyform'), false);
                })
                .catch(function(error) {
                    self.app.views.alerts.createAlert('Failed to load the share URL template.', 'danger');
                });
        },
        
        removeShareURLForm: function() {
            if (this.$('div#looper-copyform form').length > 0) {
                this.$('div#looper-copyform form').remove();
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
            var self = this;
            self.model.get('loops').forEach(function(loop) {
                if (exceptThisLoop && exceptThisLoop.get('loopFileId') != loop.get('loopFileId') || !exceptThisLoop) {
                    if (loop.audio) {
                        loop.audio.stop();
                    }
                }
            });
        },
        
        saveFormSubmit: function(ev) {
            ev.preventDefault();
            var name = this.$('input[name=looper-name]').val();
            if (!name) {
                this.app.views.alerts.createAlert('You must provide a name for your looper.', 'danger');
                return;
            }
            if (name.length < 4 || name.length > 30) {
                this.app.views.alerts.createAlert('The looper name must be more than 4 characters, but less than 30.', 'danger');
                return;
            }
            this.saveLoops();
        },
                
        saveLoops: function() {
            var self = this;
            var dropBoxDir = self.app.config.dropBoxDir;
            
            self.app.models.dropBox.dirExists(dropBoxDir)
                .then(function(exists) {
                    self.app.dispatcher.trigger('status', 'Preparing your Dropbox...');
                    return exists ? null : self.app.models.dropBox.makeDir(dropBoxDir);                    
                })
                .then(function() { 
                    var promises = [];
                    for (var i = 0; i < self.model.get('loops').models.length; i++) {
                        var loop = self.model.get('loops').models[i];
                        var fileName = loop.get('loopFileId') + '.' + loop.get('fileExtension');
                        if (loop.get('dropboxURL')) {
                            self.app.dispatcher.trigger('status', '"' + fileName + '" is already available from Dropbox...');
                        } else {
                            var data = loop.dataURItoBlob(loop.audio.get('src'));
                            if (data) {
                                self.app.dispatcher.trigger('status', 'Saving "' + loop.get('name') + '" to Dropbox...');
                                promises.push(self.app.models.dropBox.saveFileToDropbox(dropBoxDir + '/' + fileName, data));
                            }
                        }
                    }
                    return RSVP.all(promises);
                })
                .then(function(fileStats) {
                    if (fileStats.length > 0) {
                        var promises = _.map(fileStats, function(fileStat) {
                            return self.app.models.dropBox.getShareURL(fileStat.path);
                        });
                        self.app.dispatcher.trigger('status', 'Getting URLs for the uploaded files...');
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
                                var loop = self.model.get('loops').findWhere({loopFileId: loopFileId});
                                loop.set('dropboxURL', url);
                            }
                        }
                    }
                })
                .then(function() {
                    self.app.dispatcher.trigger('status', 'Saving your Looper metadata to our servers...');
                    return self.model.saveWithPromise();
                })
                .then(function() {
                    self.app.dispatcher.trigger('status', 'Done!');
                    self.app.dispatcher.trigger('looper-saved', self.model);
                })
                .catch(function(error) {
                    self.app.views.alerts.createAlert('There was a problemn saving your looper - please try again.', 'danger');
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
            var name = this.$('input[name=looper-name]').val();
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
                    self.app.views.alerts.createAlert('There was a problem loading the loop - please try again.', 'danger');
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
                        self.app.views.alerts.createAlert('There was a problem loading the looper - please try again.', 'danger');
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
                    self.app.views.alerts.createAlert('There was a problem loading the loop file - please try again.', 'danger');
                });
        },
        
        onLooperNavigated: function(url) {
            this.addShareURLForm(url);
            this.removeSaveForm();
        },
                
        initialize: function() {
            this.model = new Looper();
            this.listenTo(this.app.dispatcher, 'signed-out', this.onAuthChange);
            this.listenTo(this.app.dispatcher, 'signed-in', this.onAuthChange);
            this.listenTo(this.app.dispatcher, 'menu-change', this.onMenuChange);
            this.listenTo(this.app.dispatcher, 'looper-selected', this.setLooper);
            this.listenTo(this.app.dispatcher, 'looper-navigated', this.onLooperNavigated);
            this.listenTo(this.app.dispatcher, 'file-read', this.onLoopFileRead);
            this.listenTo(this.app.dispatcher, 'loop-loaded', this.addSaveForm);
            this.listenTo(this.app.dispatcher, 'change-volume', this.changeVolumes);
            this.listenTo(this.app.dispatcher, 'change-pitch', this.changePitches);
            this.listenTo(this.app.dispatcher, 'signed-in-user-info', this.setUserId);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 