/* jshint browser: true */

define(['draggableWindow', 'frozenBackground', 'sound'], function(draggableWindow, frozenBackground, sound){ 
    var windowsXPErrorSimulator = function(){
        var displayDelay = 1025;

        var init = function(){
            addEventListeners();
            displayDraggableWindow();
        };

        var addEventListeners = function(){
            addMouseDownEventListenerToTheWholePage();
            draggableWindow.addMouseDownEventListenerToTitleBar();
            addMouseUpEventListenerToTheWholePage();
            addMouseMoveEventListenerToTheWholePage();
            addWindowResizeEventListenerToTheWholePage();
        };

        var addMouseDownEventListenerToTheWholePage = function(){
            document.addEventListener('mousedown', function(event) {
                if(event.target.id != "draggable-window" && event.target.id != "draggable-window__title-bar-area")
                    playForcedFocusAnimation();
            }, true);
        };

        var addMouseUpEventListenerToTheWholePage = function(){
            document.addEventListener('mouseup', function() {
                draggableWindow.onMouseUpEvent();
            }, true);
        };

        var addMouseMoveEventListenerToTheWholePage = function(){
            document.addEventListener('mousemove', function(event) {
                event.preventDefault();
                var draggableWindowMoved = draggableWindow.onMouseMoveEvent(event);
                if(draggableWindowMoved){
                    var draggableWindowCoordinates = draggableWindow.getCoordinates();
                    frozenBackground.addFrozenErrorWindow(draggableWindowCoordinates.x, draggableWindowCoordinates.y);
                }
            }, true);
        };

        var addWindowResizeEventListenerToTheWholePage = function(){
            window.onresize = function(){
                draggableWindow.onWindowResizeEvent();
            };
        };

        var displayDraggableWindow = function(){
            setTimeout(function(){
                sound.playErrorSound();
                draggableWindow.display();
            }, displayDelay);
        };

        var playForcedFocusAnimation = function(){
            sound.playDingSound();
            draggableWindow.playForcedFocusAnimation();
        };

        init();
    }();
});
