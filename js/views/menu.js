/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var View = Backbone.View.extend({
        
        el: '#view-menu',
        
        events: {
            'click li a': 'menuChange'
        },
        
        activeDefault: function() {
            this.$el.find('a[data-bodyview=createform]').click();
        },
        
        menuChange: function(ev) {
            ev.preventDefault();
            
            var el = $(ev.currentTarget);
                        
            var targetView = el.attr('data-bodyview');
            var currentView = this.$el.find('li.active a').attr('data-bodyview');

            if (currentView && currentView != targetView || !currentView) {
                this.changeBody(targetView);
            }
            
            this.changeActive(el.parent('li'));
        },
        
        changeActive: function(el) {
            this.$el.find('li').removeClass('active');
            el.addClass('active');
        },
        
        changeBody: function(bodyView) {
            switch(bodyView) {
                case 'createform':
                    this.$el.find('div#view-body').html(this.app.views.createform.$el);
                    this.app.views.createform.render();
                    break;
                    
                case 'findlooper':
                    this.$el.find('div#view-body').html(this.app.views.findlooper.$el);
                    this.app.views.findlooper.render();
                    break;
            }
        },
                
        initialize: function() {},
        
        render: function() {}
        
    });
    
    return View;
    
});
