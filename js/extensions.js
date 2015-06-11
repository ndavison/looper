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
             * A store for template files to be cached.
             */
            Backbone.View.prototype.templates = {};
        
            /**
             * Retrieve this view's HTML via AJAX or the template store.
             */
            Backbone.View.prototype.getTemplate = function(template, data, cb) {
                var view = this;
                cb = cb || function() {};
                data = data || {};
                var makeTemplate = function(res, data, cb) {
                    res = _.template(res);
                    var compiled = res(data);
                    cb(compiled);
                };
                if (Backbone.View.prototype.templates[template]) {
                    res = Backbone.View.prototype.templates[template];
                    makeTemplate(res, data, cb);
                } else {
                    $.get(template, function(res) {
                        Backbone.View.prototype.templates[template] = res;
                        makeTemplate(res, data, cb);
                    });
                }
            };
            
        }
        
    };
    
    return Extensions;
    
});
