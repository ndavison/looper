/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var Model = Backbone.Model.extend({
        
        url: '/looper/api/loopers',
        
        idAttribute: '_id',
        
        defaults: {
            name: '',
            userId: '',
            loops: null
        },
        
        /**
         * Override model#parse so the loops data coming back 
         * doesn't clobber the Loops collection instance we 
         * already have, since the Loop instances inside it maintain 
         * a non-Backbone property for the audio data that we don't 
         * want synced to our server.
         *
         * @param {Object} response - The response back from the server.
         */
        parse: function(response) {
            var obj = {};
            obj._id = response._id;
            obj.name = response.name;
            obj.userId = response.userId;
            if (this.get('loops')) {
                obj.loops = this.get('loops');
            } else {
                obj.loops = response.loops;
            }
            return obj;
        }
        
    });
    
    return Model;
    
});
 