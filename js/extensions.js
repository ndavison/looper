/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery'], function(Backbone, $) {
    
    var Extensions = function() {
        
        /**
         * Backbone extensions.
         */
        this.backbone = function(app) {        
        
            /**
             * Make the global app instance a property of all views, models and collections.
             */
            Backbone.View.prototype.app = app;
            Backbone.Model.prototype.app = app;
            Backbone.Collection.prototype.app = app;
        
            /**
             * A common view AJAX request and display.
             */
            Backbone.View.prototype.getView = function(view, el, cb) {
                cb = cb || function() {};
                $.get(view, function(res) {
                    el.hide().html(res).fadeIn(300, cb);
                });
            };
        }
        
    };
    
    return Extensions;
    
});
