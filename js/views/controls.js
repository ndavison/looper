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
            'input input[name=loopers-pitch]': 'changedPitch'
        },
        
        changedPitch: function(ev) {
            this.app.dispatcher.trigger('change-pitch', this.getPitch());
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
            var self = this;
            if (self.$('input[name=loopers-pitch]').length == 0) {
                self.getTemplate(self.app.config.siteRoot + '/views/controls.html', {pitch: self.defaultValues.pitch})
                    .then(function(res) {
                        return self.show(res);
                    }).catch(function(error) {
                        self.app.views.alerts.createAlert('Failed to load the playback controls template.', 'danger');
                    });
            }
        }
        
    });
   
    return View;
    
});
 