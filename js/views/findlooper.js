/**
 *
 *
 *
 *
 */

define(['backbone', 'models/loopers'], function(Backbone, Loopers) {

    "use strict";
    
    var View = Backbone.View.extend({
                
        events: {
            'submit form': 'doSearch',
            'click div#findlooper-results a': 'selectLooper'
        },
        
        searchterm: '',
        
        doSearch: function(ev) {
            ev.preventDefault();
            var self = this;
            var term = this.$('input[name=looper-searchterm]').val();
            if (term) {
                this.searchterm = term;
                this.collection.searchterm = term;
                this.collection.fetchWithPromise({reset: true})
                    .then(function(response) {
                        self.showResults();
                    })
                    .catch(function(error) {
                        self.app.views.alerts.createAlert('There was a problem contacting the server - please try again later.', 'danger');
                    });
            }
        },
        
        showResults: function() {
            var self = this;
            self.getTemplate('/looper/views/findlooper-results.html', {loopers: self.collection.models}).then(function(response) {
                return self.show(response, self.$('div#findlooper-results'));
            }).catch(function(error) {
                self.app.views.alerts.createAlert('Failed to load the search results template.', 'danger');
            });
        },
        
        removeResults: function() {
            this.$('div#findlooper-results').find('*').remove();
        },
        
        selectLooper: function(ev) {
            ev.preventDefault();
            var looperId = $(ev.currentTarget).attr('data-looperid');
            if (looperId) {
                var looper = this.collection.findWhere({_id: looperId});
                if (looper) {
                    this.app.dispatcher.trigger('looper-selected', looper);
                    this.removeResults();
                }
            }
        },
        
        initialize: function() {
            this.collection = new Loopers();
        },
        
        render: function() {
            var self = this;
            self.getTemplate('/looper/views/findlooper.html').then(function(res) {
                self.show(res);
                self.delegateEvents();
            })
            .catch(function(error) {
                self.app.views.alerts.createAlert('Failed to load the find looper form template.', 'danger');
            });
        }
        
    });
    
    return View;
    
});
