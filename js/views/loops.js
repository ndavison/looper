/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone'], function(Backbone) {
   
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
            view.getTemplate('/looper/views/playloop.html', {loopId: loop.get('loopId'), name: loop.get('name'), enabled: loop.getAudioProperties().audioData ? true : false}, function(res) {
                view.show(res, view.$el.find('div#loops-buttons'), true);
                view.addSaveForm();
            });
        },
        
        enableLoopButton: function(loop) {
            var view = this;
            var loopId = loop.get('loopId');
            if (loopId) {
                if (view.$el.find('button[data-loopid=' + loopId + ']').length > 0) {
                    // the button is available, so remove its disabled attribute
                    var el = view.$el.find('button[data-loopid=' + loopId + ']');
                    el.removeAttr('disabled');
                }
            }
        },
        
        addSaveForm: function() {
            var view = this;
            if (view.$el.find('form#view-saveform').length == 0) {
                view.getTemplate('/looper/views/saveloops.html', {}, function(res) {
                    view.show(res, view.$el.find('div#loops-saveform'), false);
                });
            }
        },
        
        playLoop: function(ev) {
            ev.preventDefault();
            var target = ev.currentTarget;
            var loopId = $(target).attr('data-loopid');
            var loop = this.model.findWhere({loopId: loopId});
            if (loop) {
                this.stopLoops(loop);
                loop.playLoop();
            }
        },
        
        stopLoops: function(exceptThisLoop) {
            var view = this;
            view.model.forEach(function(loop) {
                if (exceptThisLoop && exceptThisLoop.get('loopId') != loop.get('loopId') || !exceptThisLoop) {
                    loop.stopLoop();
                }
            });
        },
        
        saveLoops: function() {
            var view = this;
            view.model.forEach(function(loop) {
                view.app.models.dropBox.saveFileToDropbox(loop);
            });
        },
        
        changeVolumes: function(level) {
            this.model.invoke('setVolume', level);
        },
        
        changePitches: function(level) {
            this.model.invoke('setPitch', level);
        },
        
        setUserId: function(info) {
            if (info.uid) {
                this.model.userId = info.uid;
                this.model.forEach(function(loop) {
                    loop.set('userId', info.uid);
                });
            }
        },
        
        setShareURL: function(params) {
            if (params.shareURL && params.loop) {
                var loop = this.model.findWhere({loopId: params.loop.get('loopId')});
                if (loop) {
                    loop.set('dropboxURL', params.shareURL);
                }
            }
        },
        
        setLooperName: function() {
            var name = this.$el.find('input[name=looper-name]').val();
            if (name) {
                this.model.forEach(function(loop) {
                    loop.set('looperName', name);
                });
            }
        },
        
        addLoopToCollection: function(loop) {
            loop.set('looperId', this.model.looperId);
            loop.set('userId', this.model.userId);
            this.model.add(loop);
        },
                
        initialize: function() {
            var dispatcher = this.app.dispatcher;
            dispatcher.on('loop-loaded', this.enableLoopButton, this);
            dispatcher.on('loop-added', this.addLoopToCollection, this);
            dispatcher.on('loop-added', this.addLoopButton, this);
            dispatcher.on('save-loops', this.saveLoops, this);
            dispatcher.on('change-volume', this.changeVolumes, this);
            dispatcher.on('change-pitch', this.changePitches, this);
            dispatcher.on('signed-in-user-info', this.setUserId, this);
            dispatcher.on('dropbox:shareurl-created', this.setShareURL, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 