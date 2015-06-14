/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone'], function(Backbone) {
    
    var View = Backbone.View.extend({
        
        el: '#view-alerts',
        
        events: {
            'click button.close': 'removeAlert'
        },
        
        alertEl: null,
        
        createAlert: function(msg, type) {
            this.alertEl = $('<div></div>').addClass('alert alert-dismissible alert-' + type).html(msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>').hide();
            this.$el.html(this.alertEl);
            this.alertEl.fadeIn(200);          
        },
        
        removeAlert: function(ev, cb) {
            ev.preventDefault();
            cb = cb || function() {};
            this.alertEl.fadeOut(300, cb);
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
    
    return View;
});
