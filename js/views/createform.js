/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery', 'models/audiofiles', 'models/audiofile'], function(Backbone, $, AudioFiles, AudioFile) {
    
    var View = Backbone.View.extend({
        
        el: '#view-createform',
        
        audioFiles: null,
        
        events: {
            'click button#create-loop': 'createLoop',
            'click button#demo-loop': 'demoLoop'
        },
        
        createLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var file = this.$el.find('input[name="looper-file"]');
            var audioFile = new AudioFile({context: view.audioFiles.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            audioFile.readFile(file[0].files[0], function(model) {
                if (!model.get('fileType').match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file must be a WAV, MP3 or OGG audio file.', 'danger');
                    return;
                }
                view.audioFiles.add(audioFile);
                view.app.dispatcher.trigger('loop-added', {name: view.$el.find('input[name=looper-name]').val(), loopId: audioFile.get('loopId')});
            });
        },
        
        demoLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var audioFile = new AudioFile({context: view.audioFiles.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            audioFile.readFromURL("/audioclip-1433848478.wav", function(model) {
                view.audioFiles.add(audioFile);
                view.app.dispatcher.trigger('loop-added', {name: 'Demo Loop', loopId: audioFile.get('loopId')});
            });
        },
        
        initialize: function() {
            this.audioFiles = new AudioFiles();
        },
        
        render: function() {}
        
    });
    
    return View;
});
