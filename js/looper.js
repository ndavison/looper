/**
 *
 *
 *
 *
 */

(function($) {
    
    $(document).ready(function() {
        
        var reader = new FileReader();
        var loops = [];
        var globalVolume = 1;
        
        reader.onload = function(ev) {
            var data = ev.target.result;
                        
            var loopH5 = $('<audio></audio>');
            loopH5.attr('src', data);
            loopH5.on('loadedmetadata', function() {
                var loop = new SeamlessLoop();
                console.log(this.duration * 1000);
                loop.addUri(data, this.duration * 1000, 'loop1');
                loops.push(loop);
                loop.callback(function () {
                    $('div#looper-loops').append(loopElement($('input[name=looper-name]').val(), loop));
                });
                loopH5.remove();
            });
        };
        
        /**
         * An event to stop all loops.
         */
        $(document).on('stop-all-loops', function() {
            console.log('stopping all loops...');
            for (var i = 0; i < loops.length; i++) {
                if (loops[i].timeout) {
                    loops[i].stop();
                }
            }
        });
        
        /**
         * Global volume control.
         */
        $(document).on('change-all-volumes', function(ev, level) {
            globalVolume = level;
            for (var i = 0; i < loops.length; i++) {
                if (loops[i].timeout) {
                    loops[i].volume(level);
                }
            }
        });
        
        /**
         * File read on "Create" click.
         */
        $(document).on('click', '#looper-button', function(ev) {
            ev.preventDefault();
            var file = $('input[name="looper-file"]');
            reader.readAsDataURL(file[0].files[0])
        });
        
        /**
         * Volume change handler.
         */
        $(document).on('mousemove', 'input[name=loopers-volume]', function() {
            $(document).trigger('change-all-volumes', this.value / 100);
        });
        
        /**
         * Helper function to generate a loop's button.
         */
        var loopElement = function(name, loop) {
            var button = $('<button></button>').addClass('btn btn-default').html(name);
            button.on('click', function(ev) {
                ev.preventDefault();
                $(document).trigger('stop-all-loops');
                console.log('playing loop...');
                loop.start('loop1');
                loop.volume(globalVolume);
            });
            return $('<div></div>').addClass('col-md-1 col-sm-2 col-xs-4').html(button);
        };
    });
    
})(jQuery);
