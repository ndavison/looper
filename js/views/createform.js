/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'jquery','rsvp', 'dropboxdropins', 'models/loop'], function(Backbone, $, RSVP, Dropbox, Loop) {
    
    var View = Backbone.View.extend({
        
        events: {
            'change input[name=looper-file]': 'getFromFileReader',
            'click button#dropbox-loop': 'getFromDropbox'
        },
        
        addLoadFromDropboxButton: function() {
            var view = this;
            if (view.$el.find('button#dropbox-loop').length == 0) {
                view.getTemplate('/looper/views/loadfromdropbox.html').then(function(res) {
                    return view.show(res, view.$el.find('div:last-child'), true);
                }).catch(function(error) {
                    console.log(error);
                });
            }
        },
        
        removeLoadFromDropboxButton: function() {
            this.$el.find('button#dropbox-loop').remove();
        },
        
        getFromFileReader: function(ev) {
            ev.preventDefault();
            var view = this;
            var fileEl = this.$el.find('input[name="looper-file"]');
            var loops = [];
            var promises = [];
            
            for (var i = 0; i < fileEl[0].files.length; i++) {
                var file = fileEl[0].files.item(i);
                if (!file.type.match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file ' + file.name + ' was not an audio file! supported formats include WAV, MP3 and OGG.', 'danger');
                    continue;
                }
                var loop = new Loop({name: file.name});
                loops.push(loop);
                view.app.dispatcher.trigger('loop-added', loop);
                
                promises.push(loop.readFile(file).then(function(loop) {
                    loop.audio.setVolume(view.app.views.controls.getVolume());
                    loop.audio.setPitch(view.app.views.controls.getPitch());
                    view.app.dispatcher.trigger('loop-loaded', loop);
                }));
            }
            
            RSVP.all(promises).then(function(loops) {
                view.app.dispatcher.trigger('loops-added', loops);
            }).catch(function(error) {
                console.log(error);
            });
        },
        
        getFromDropbox: function(ev) {
            ev.preventDefault();
            var view = this;
            var loops = [];
            
            Dropbox.appKey = view.app.config.dropboxDropinKey;
            Dropbox.choose({multiselect: true, linkType: 'direct', extensions: ['audio'], success: function(files) {
                if (files.length > 0) {
                    var promises = [];
                    
                    for (var i = 0; i < files.length; i++) {
                        var loop = new Loop({name: files[i].name, dropboxURL: files[i].link});
                        loops.push(loop);
                        view.app.dispatcher.trigger('loop-added', loop);
                        
                        promises.push(loop.readFromURL(files[i].link).then(function(loop) {
                            loop.audio.setVolume(view.app.views.controls.getVolume());
                            loop.audio.setPitch(view.app.views.controls.getPitch());
                            view.app.dispatcher.trigger('loop-loaded', loop);
                        }));
                    }
                    
                    RSVP.all(promises).then(function(loops) {
                        view.app.dispatcher.trigger('loops-added', loops);
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }});
        },
        
        initialize: function() {
            this.app.dispatcher.on('signed-in', this.addLoadFromDropboxButton, this);
            this.app.dispatcher.on('signed-out', this.removeLoadFromDropboxButton, this);
        },
        
        render: function() {
            var self = this;
            self.getTemplate('/looper/views/createform.html').then(function(res) {
                self.show(res);
                self.delegateEvents();
            }).then(function() {
                if (self.app.models.dropBox.isAuthenticated()) {
                    self.addLoadFromDropboxButton();
                }
            }).catch(function(error) {
                console.log(error);
            });
        }
        
    });
    
    return View;
});
