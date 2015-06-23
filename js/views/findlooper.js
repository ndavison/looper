/**
 *
 *
 *
 *
 */

"use strict";
 
define(['backbone', 'models/loopers'], function(Backbone, Loopers) {
    
    var View = Backbone.View.extend({
                
        events: {
            'click button': 'doSearch'
        },
        
        searchterm: '',
        
        doSearch: function(ev) {
            ev.preventDefault();
            var self = this;
            var term = this.$el.find('input[name=looper-searchterm]').val();
            if (term) {
                this.searchterm = term;
                this.collection.searchterm = term;
                this.collection.fetchWithPromise({reset: true})
                    .then(function(response) {
                        self.showResults();
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        
        showResults: function() {
            var self = this;
            self.getTemplate('/looper/views/findlooper-results.html', {loopers: self.collection.models}).then(function(response) {
                return self.show(response, self.$el.find('div#findlooper-results'));
            }).catch(function(error) {
                console.log(error);
            });
        },
        
        initialize: function() {
            this.collection = new Loopers();
        },
        
        render: function() {
            var self = this;
            self.getTemplate('/looper/views/findlooper.html', {searchterm: self.searchterm}).then(function(res) {
                self.show(res);
                self.delegateEvents();
            })
            .then(function() {
                if (self.collection.models.length > 0 || self.searchterm) {
                    self.showResults();
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        }
        
    });
    
    return View;
    
});
