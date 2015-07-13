/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {

    "use strict";
    
    var View = Backbone.View.extend({
        
        el: '#view-menu',
        
        events: {
            'click li a': 'menuChange'
        },
        
        activeDefault: function() {
            if (this.$('.active').length == 0) {
                this.$('a[data-bodyview=createform]').click();
            }
        },
        
        menuChange: function(ev) {
            ev.preventDefault();
            
            var el = $(ev.currentTarget);
                        
            var targetView = el.attr('data-bodyview');
            var currentView = this.$('li.active a').attr('data-bodyview');

            if (currentView && currentView != targetView || !currentView) {
                this.changeBody(targetView);
            }
            
            this.changeActive(el.parent('li'));
        },
        
        changeActive: function(el) {
            this.$('li').removeClass('active');
            el.addClass('active');
        },
        
        changeBody: function(bodyView) {
            switch(bodyView) {
                case 'createform':
                    this.$('div#view-body').html(this.app.views.createform.$el);
                    this.app.views.createform.render();
                    this.app.mode = 'create';
                    break;
                    
                case 'findlooper':
                    this.$('div#view-body').html(this.app.views.findlooper.$el);
                    this.app.views.findlooper.render();
                    this.app.mode = 'find';
                    break;
            }
            
            this.app.dispatcher.trigger('menu-change', this.app.mode);
        },
        
        onLooperFromURL: function() {
            this.$('a[data-bodyview=findlooper]').click();
        },
                
        initialize: function() {
            this.listenTo(this.app.dispatcher, 'looper-from-url', this.onLooperFromURL);
        },
        
        render: function() {}
        
    });
    
    return View;
    
});
