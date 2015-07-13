/**
 *
 *
 *
 *
 */
 
define(['backbone', 'models/loop'], function(Backbone, Loop) {

    "use strict";
    
    var Collection = Backbone.Collection.extend({
        
        model: Loop,
        
        initialize: function() {}
        
    });
    
    return Collection;
    
});
