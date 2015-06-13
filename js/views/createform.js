/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery', 'models/audiofiles', 'models/audiofile'], function(Backbone, $, AudioFiles, AudioFile) {
    
    var View = Backbone.View.extend({
        
        el: '#view-createform',
        
        events: {
            'click button#create-loop': 'createLoop',
            'click button#demo-loop': 'demoLoop'
        },
        
        createLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var file = this.$el.find('input[name="looper-file"]');
            var audioFile = new AudioFile({name: view.$el.find('input[name=looper-name]').val(), context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            audioFile.readFile(file[0].files[0], function(model) {
                if (!model.get('fileType').match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file must be a WAV, MP3 or OGG audio file.', 'danger');
                    return;
                }
                view.app.dispatcher.trigger('loop-added', model);
            });
        },
        
        demoLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var audioFile = new AudioFile({name: 'Demo Loop', context: view.app.views.loops.model.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            audioFile.readFromURL("/audioclip-1433848478.wav", function(model) {
                view.app.dispatcher.trigger('loop-added', model);
            });
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
    
    return View;
});
