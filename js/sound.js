define([], function(){ 
    var sound = (function(){
        var errorSound = document.getElementById("error-sound");
        var dingSound = document.getElementById("ding-sound");

        var playErrorSound = function(){
            errorSound.play();
        };

        var playDingSound = function(){
            dingSound.play();
        };

        return {
            playErrorSound: playErrorSound,
            playDingSound: playDingSound
        };
    }());
    
    return sound;
});