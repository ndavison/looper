/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'models/loop'], function(Backbone, Loop) {
    
    var Collection = Backbone.Collection.extend({
        
        url: '/looper/api/loops',
        
        model: Loop,
        
        context: null,
                
        setUserId: function(info) {
            if (info.uid) {
                this.userId = info.uid;
                this.forEach(function(loop) {
                    loop.set('userId', info.uid);
                });
            }
        },
        
        setShareURL: function(params) {
            if (params.shareURL && params.loop) {
                var loop = this.findWhere({loopId: params.loop.get('loopId')});
                if (loop) {
                    loop.set('dropboxURL', params.shareURL);
                }
            }
        },
        
        setLoopAttributes: function(loop) {
            loop.set('looperId', this.looperId);
            loop.set('userId', this.userId);
        },
                        
        stopAll: function() {
            this.invoke('stopLoop');
        },
        
        playLoop: function(loopId) {
            var loop = this.findWhere({loopId: loopId});
            if (loop && typeof loop.playLoop == 'function') {
                loop.playLoop();
            }
        },
        
        changeVolumes: function(level) {
            this.invoke('setVolume', level);
        },
        
        changePitches: function(level) {
            this.invoke('setPitch', level);
        },
        
        saveLoops: function() {
            var model = this;
            model.app.dispatcher.trigger('dropbox-prepare', function() {
                model.forEach(function(loop) {
                    model.app.dispatcher.trigger('save-loop', loop);
                }); 
            });
        },
             
        initialize: function() {
            this.looperId = Math.random().toString(36).replace(/[^a-z]+/g, '');
            this.app.dispatcher.on('loop-added', this.add, this);
            this.app.dispatcher.on('loop-added', this.setLoopAttributes, this);
            this.app.dispatcher.on('play-loop', this.stopAll, this);
            this.app.dispatcher.on('play-loop', this.playLoop, this);
            this.app.dispatcher.on('save-loops', this.saveLoops, this);
            this.app.dispatcher.on('change-volume', this.changeVolumes, this);
            this.app.dispatcher.on('change-pitch', this.changePitches, this);
            this.app.dispatcher.on('signed-in-user-info', this.setUserId, this);
            this.app.dispatcher.on('dropbox-url-created', this.setShareURL, this);
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        
    });
    
    return Collection;
    
});
