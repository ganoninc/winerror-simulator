define([], function(){ 
    var frozenBackground = (function(){
        var canvas = document.getElementById("frozen-background-simulator__canvas");
        var context = canvas.getContext("2d");
        var baseImage = document.getElementById("frozen-background-simulator__base-image");
        
        var init = function(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.display = "block";
        };

        var addFrozenErrorWindow = function(x,y){
            context.drawImage(baseImage, x, y);
        };

        init(); 

        return {
            addFrozenErrorWindow: addFrozenErrorWindow
        };
    }());

    return frozenBackground;
});