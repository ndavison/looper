/**
 *
 *
 *
 *
 */

"use strict";
 
define(['backbone'], function(Backbone) {
    
    var Collection = Backbone.Collection.extend({
        
        url: function() {
            var url = '/looper/api/loopers';
            if (this.searchterm) {
                url += '/search/' + this.searchterm;
            }
            return url;
        },
        
        searchterm: '',
        
        initialize: function() {}
        
    });
    
    return Collection;
    
});
