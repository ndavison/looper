/**
 *
 *
 *
 *
 */

define(['backbone', 'models/looper'], function(Backbone, Looper) {

    "use strict";
    
    var Collection = Backbone.Collection.extend({
        
        url: function() {
            var url = '/looper/api/loopers';
            if (this.searchterm) {
                url += '/search/' + this.searchterm;
            }
            return url;
        },
        
        searchterm: '',
        
        model: Looper,
        
        initialize: function() {}
        
    });
    
    return Collection;
    
});
