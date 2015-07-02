/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery', 'rsvp'], function(Backbone, $, RSVP) {
    
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
            Backbone.Router.prototype.app = app;
        
            /**
             * A store for template files to be cached.
             */
            Backbone.View.prototype.templates = {};
        
            /**
             * Retrieve this view's HTML via AJAX or the template store.
             */
            Backbone.View.prototype.getTemplate = function(template, data) {
                var view = this;
                data = data || {};
                
                return new RSVP.Promise(function(resolve, reject) {
                    
                    var makeTemplate = function(res, data) {
                        res = _.template(res);
                        var compiled = res(data);
                        resolve(compiled);
                    };
                    
                    if (Backbone.View.prototype.templates[template]) {
                        res = Backbone.View.prototype.templates[template];
                        makeTemplate(res, data);
                    } else {
                        $.get(template + "?bust=" +  (new Date()).getTime()).done(function(res) {
                            Backbone.View.prototype.templates[template] = res;
                            makeTemplate(res, data);
                        }).fail(function() {
                            reject(Error(error));
                        });
                    }
                });
            };
            
            /**
             * A standard way to show a view.
             */
            Backbone.View.prototype.show = function(contents, el, append) {
                contents = contents || this.$el.html();
                el = el ? $(el) : this.$el;
                append = typeof append != 'undefined' ? append : false;
                
                return new RSVP.Promise(function(resolve, reject) {
                    if (append) {
                        var newEl = $(contents);
                        newEl.hide().appendTo(el).fadeIn(300, function() {
                            resolve(newEl);
                        });
                    } else {
                        el.hide().html(contents).fadeIn(300, function() {
                            resolve(el);
                        });
                    }
                    
                });
            };
            
            /**
             * Backbone.Model#save as an RSVP Promise.
             */
            Backbone.Model.prototype.saveWithPromise = function() {
                var self = this;
                var saveArguments = arguments;
                return new RSVP.Promise(function(resolve, reject) {
                    var save = Backbone.Model.prototype.save.apply(self, saveArguments);
                    save
                        .done(function(data, textStatus, jqXHR) {
                            resolve(data);
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            reject(Error(textStatus));
                        });
                    
                });
            };
            
            /**
             * Backbone.Model#fetch as an RSVP Promise.
             */
            var fetchWithPromise = function() {
                var self = this;
                var fetchArguments = arguments;
                return new RSVP.Promise(function(resolve, reject) {
                    fetchArguments[0].success = function(collection, response, options) {
                        resolve(response);
                    };
                    fetchArguments[0].error = function(collection, response, options) {
                        reject(response);
                    };
                    Backbone.Collection.prototype.fetch.apply(self, fetchArguments);
                });
            };
            Backbone.Model.prototype.fetchWithPromise = fetchWithPromise;
            Backbone.Collection.prototype.fetchWithPromise = fetchWithPromise;
            
        }
        
    };
    
    return Extensions;
    
});
