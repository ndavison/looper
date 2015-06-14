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
            'click button#create-loop': 'createLoop',
            'click button#dropbox-loop': 'getFromDropbox'
        },
        
        addLoadFromDropboxButton: function() {
            var view = this;
            if (view.$el.find('button#dropbox-loop').length == 0) {
                view.getTemplate('/looper/views/loadfromdropbox.html', {}, function(res) {
                    view.show(res, view.$el.find('div#create-buttons'), true);
                });
            }
        },
        
        removeLoadFromDropboxButton: function() {
            this.$el.find('button#dropbox-loop').remove();
        },
        
        createLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var file = this.$el.find('input[name="looper-file"]');
            var loop = new Loop({name: view.$el.find('input[name=looper-name]').val(), context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            loop.readFile(file[0].files[0], function(model) {
                if (!model.get('fileType').match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file must be a WAV, MP3 or OGG audio file.', 'danger');
                    return;
                }
                view.app.dispatcher.trigger('loop-added', model);
            });
        },
        
        getFromDropbox: function(ev) {
            ev.preventDefault();
            var view = this;
            Dropbox.appKey = view.attributes.dropboxDropinKey;
            Dropbox.choose({multiselect: true, linkType: 'direct', extensions: ['audio'], success: function(files) {
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        var loop = new Loop({name: files[i].name, dropboxURL: files[i].link, context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
                        loop.readFromURL(files[i].link, function(model) {
                            view.app.dispatcher.trigger('loop-added', model);
                        });
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
