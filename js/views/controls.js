/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-controls',
        
        events: {
            'input input[name=loopers-volume]': 'changedVolume',
            'input input[name=loopers-pitch]': 'changedPitch'
        },
                
        changedVolume: function(ev) {
            this.app.dispatcher.trigger('change-volume', this.getVolume());
        },
        
        changedPitch: function(ev) {
            this.app.dispatcher.trigger('change-pitch', this.getPitch());
        },
        
        getVolume: function() {
            return (this.$el.find('input[name=loopers-volume]').val() / 100);
        },
        
        getPitch: function() {
            return (this.$el.find('input[name=loopers-pitch]').val() / 100);
        },
        
        initialize: function() {
            this.app.dispatcher.on('loop-added', this.render, this);
        },
        
        render: function() {
            var view = this;
            if (view.$el.find('input[name=loopers-volume]').length == 0 &&
                view.$el.find('input[name=loopers-pitch]').length == 0
            ) {
                view.getTemplate('/looper/views/controls.html', {}, function(res) {
                    view.show(res);
                });
            }
        }
        
    });
   
    return View;
    
});
 