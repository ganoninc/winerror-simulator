/* jshint browser: true */

/* 

    Credit to jnoreiga@stackoverflow.com (https://stackoverflow.com/questions/9334084/moveable-draggable-div)

*/

var draggableWindow = function(){
    var displayDelay = 2500;
    var div = document.getElementById("draggable-window");
    var divTitleBarArea = document.getElementById("draggable-window__title-bar-area");
    var divHeight = 120;
    var divWidth = 354;
    var mousePosition;
    var offset = [0,0];
    var isDown = false;

    var init = function(){
        addEventListeners();
        setTimeout(display, displayDelay);
    };

    var addEventListeners = function(){
        addMouseDownEventListenerToTitleBarArea();
        addMouseUpEventListenerToTheWholePage();
        addMouseMoveEventListenerToTheWholePage();
    };

    var addMouseDownEventListenerToTitleBarArea = function(){
        divTitleBarArea.addEventListener('mousedown', function(e) {
            isDown = true;
            offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }, true);
    };

    var addMouseUpEventListenerToTheWholePage = function(){
        document.addEventListener('mouseup', function() {
            isDown = false;
        }, true);
    };

    var addMouseMoveEventListenerToTheWholePage = function(){
        document.addEventListener('mousemove', function(event) {
            event.preventDefault();
            if (isDown) {
                mousePosition = {
                    x : event.clientX,
                    y : event.clientY
                };
                div.style.left = (mousePosition.x + offset[0]) + 'px';
                div.style.top  = (mousePosition.y + offset[1]) + 'px';
            }
        }, true);
    };

    var display = function(){
        centerDiv();
        div.style.display = "block";
    };

    var centerDiv = function(){
        var newDivCoordinates = getCoordinatesToCenterDiv();
        div.style.left = newDivCoordinates.left + "px";
        div.style.top  = newDivCoordinates.top + "px";
    };

    var getCoordinatesToCenterDiv = function(){
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var windowHorizontalCenter = windowWidth / 2;
        var windowVerticalCenter = windowHeight / 2;
        var divHorizontalOffset = divWidth / 2;
        var divVerticalOffset = divHeight / 2;
        return {
            "left": windowHorizontalCenter - divHorizontalOffset,
            "top": windowVerticalCenter - divVerticalOffset
        };
    };

    init();
}();