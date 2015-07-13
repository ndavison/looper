/**
 *
 *
 *
 *
 */
 
define(['backbone'], function(Backbone) {

    "use strict";
    
    var View = Backbone.View.extend({
        
        el: '#view-alerts',
        
        events: {
            'click button.close': 'removeAlert'
        },
        
        createAlert: function(msg, type) {
            var self = this;
            self.getTemplate('/looper/views/alert.html', {msg: msg, type: type})
                .then(function(res) {
                    return self.show(res, self.$el);
                })
                .catch(function(error) {
                    console.log(error);
                })
                ;
        },
        
        removeAlert: function(ev) {
            ev.preventDefault();
            this.$el.html('');
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
    
    return View;
});
