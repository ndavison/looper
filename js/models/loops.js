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
                          
        initialize: function() {
            this.looperId = Math.random().toString(36).replace(/[^a-z]+/g, '');
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        
    });
    
    return Collection;
    
});
