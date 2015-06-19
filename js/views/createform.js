/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'jquery', 'dropboxdropins', 'models/loop'], function(Backbone, $, Dropbox, Loop) {
    
    var View = Backbone.View.extend({
        
        el: '#view-createform',
        
        events: {
            'change input[name=looper-file]': 'createLoop',
            'click button#dropbox-loop': 'getFromDropbox'
        },
        
        addLoadFromDropboxButton: function() {
            var view = this;
            if (view.$el.find('button#dropbox-loop').length == 0) {
                view.getTemplate('/looper/views/loadfromdropbox.html', {}, function(res) {
                    view.show(res, view.$el.find('div:last-child'), true);
                });
            }
        },
        
        removeLoadFromDropboxButton: function() {
            this.$el.find('button#dropbox-loop').remove();
        },
        
        createLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var fileEl = this.$el.find('input[name="looper-file"]');
            var loops = [];
            var loop, file;
            for (var i = 0; i < fileEl[0].files.length; i++) {
                file = fileEl[0].files.item(i);
                if (!file.type.match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file ' + file.name + ' was not an audio file! supported formats include WAV, MP3 and OGG.', 'danger');
                    continue;
                }
                loop = new Loop({name: file.name});
                loops.push(loop);
                loop.setAudioProperties({context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
                view.app.dispatcher.trigger('loop-added', loop);
                loop.readFile(file, function(loop) {
                    view.app.dispatcher.trigger('loop-loaded', loop);
                });
            }
            if (loops.length > 0) {
                view.app.dispatcher.trigger('loops-added', loops);
            }
        },
        
        getFromDropbox: function(ev) {
            ev.preventDefault();
            var view = this;
            var loops = [];
            var loop;
            Dropbox.appKey = view.attributes.dropboxDropinKey;
            Dropbox.choose({multiselect: true, linkType: 'direct', extensions: ['audio'], success: function(files) {
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        loop = new Loop({name: files[i].name, dropboxURL: files[i].link});
                        loops.push(loop);
                        loop.setAudioProperties({context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
                        view.app.dispatcher.trigger('loop-added', loop);
                        loop.readFromURL(files[i].link, function(loop) {
                            view.app.dispatcher.trigger('loop-loaded', loop);
                        });
                    }
                    if (loops.length > 0) {
                        view.app.dispatcher.trigger('loops-added', loops);
                    }
                }
            }});
        },
        
        initialize: function() {
            this.app.dispatcher.on('signed-in', this.addLoadFromDropboxButton, this);
            this.app.dispatcher.on('signed-out', this.removeLoadFromDropboxButton, this);
        },
        
        render: function() {}
        
    });
    
    return View;
});
