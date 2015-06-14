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
            'click button#demo-loop': 'demoLoop',
            'click button#dropbox-loop': 'getFromDropbox',
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
            Dropbox.appKey = '3oyl33j84sk1elk';
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
        
        demoLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var loop = new Loop({name: 'Demo Loop', context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            loop.readFromURL("/audioclip-1433848478.wav", function(model) {
                view.app.dispatcher.trigger('loop-added', model);
            });
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
    
    return View;
});
