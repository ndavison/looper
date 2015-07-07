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
            return (this.$('input[name=loopers-volume]').val() / 100);
        },
        
        getPitch: function() {
            return (this.$('input[name=loopers-pitch]').val() / 100);
        },
        
        initialize: function() {
            this.listenTo(this.app.dispatcher, 'loop-loaded', this.render);
            this.defaultValues = {
                volume: 100,
                pitch: 100
            };
        },
        
        render: function() {
            var view = this;
            if (view.$('input[name=loopers-volume]').length == 0 &&
                view.$('input[name=loopers-pitch]').length == 0
            ) {
                view.getTemplate('/looper/views/controls.html', {volume: view.defaultValues.volume, pitch: view.defaultValues.pitch})
                    .then(function(res) {
                        return view.show(res);
                    }).catch(function(error) {
                        console.log(error);
                    });
            }
        }
        
    });
   
    return View;
    
});
 