define([], function(){ 
    var frozenBackground = (function(){
        var canvas = document.getElementById("frozen-background-simulator__canvas");
        var canvasContext = canvas.getContext("2d");
        var baseImage = document.getElementById("frozen-background-simulator__base-image");
        
        var init = function(){
            setCanvasSizeAccordingToScreenResolution();
            canvas.style.display = "block";
        };

        var setCanvasSizeAccordingToScreenResolution = function(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        var addFrozenErrorWindow = function(x,y){
            canvasContext.drawImage(baseImage, x, y);
        };

        var onViewportResizeEvent = function(){
            setCanvasSizeAccordingToScreenResolution();
        };

        init(); 

        return {
            addFrozenErrorWindow: addFrozenErrorWindow,
            onViewportResizeEvent: onViewportResizeEvent
        };
    }());

    return frozenBackground;
});