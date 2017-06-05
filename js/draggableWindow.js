/* 
    Credit to:
        - jnoreiga@stackoverflow.com (https://stackoverflow.com/questions/9334084/moveable-draggable-div)
*/

define(['delay'], function(delay){
    var draggableWindow = (function(){
        var mousePosition;
        var offset = [0,0];
        var isPointerDown = false;
        var forcedFocusAnimationDelay = 75;
        var isDown = false;

        var div = document.getElementById("draggable-window");
        var divTitleBarArea = document.getElementById("draggable-window__title-bar-area");
        var divHeight = 120;
        var divWidth = 354;
        var userHasMovedTheDiv = false;

        var display = function(){
            centerDiv();
            div.style.display = "block";
        };

        var addMouseDownEventListenerToTitleBar = function(){
            divTitleBarArea.addEventListener('mousedown', function(e) {
                isDown = true;
                offset = [
                    div.offsetLeft - e.clientX,
                    div.offsetTop - e.clientY
                ];
            }, true);
        };

        var onMouseUpEvent = function(){
            isDown = false;
        };

        var onMouseMoveEvent = function(){
            if (isDown) {
                userHasMovedTheDiv = true;
                mousePosition = {
                    x : event.clientX,
                    y : event.clientY
                };
                var viewportSize = getViewportSize();
                if(mousePosition.y > 2 && mousePosition.y < viewportSize.height - 2 && mousePosition.x > 2 && mousePosition.x < viewportSize.width - 2){
                    var newDivCoordinates = {
                        left: (mousePosition.x + offset[0]),
                        top: (mousePosition.y + offset[1])
                    };
                    moveDiv(newDivCoordinates.left, newDivCoordinates.top); 
                }
            }
        };

        var onWindowResizeEvent = function(){
            if(userHasMovedTheDiv){
                if(isDivOutsideOfTheViewport()){
                    centerDiv();
                }
            }else{
                centerDiv();
            }
        };

        var getViewportSize = function(){
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        };

        var isDivOutsideOfTheViewport = function(){
            var divCoordinates = getDivCoordinates();
            var viewportSize = getViewportSize();
            var isDivVerticallyOutside = divCoordinates.top + 25 > viewportSize.height;
            var isDivHorizontallyOutside = divCoordinates.left + 25 > viewportSize.width;
            return isDivVerticallyOutside || isDivHorizontallyOutside;
        };

        var getDivCoordinates = function(){
            return{
                left: parseInt(div.style.left, 10),
                top: parseInt(div.style.top, 10)
            };
        };

        var moveDiv = function(left, top){
            div.style.left = left + "px";
            div.style.top  = top + "px";
        };

        var centerDiv = function(){
            var newDivCoordinates = getCoordinatesToCenterDiv();
            moveDiv(newDivCoordinates.left, newDivCoordinates.top);
        };

        var getCoordinatesToCenterDiv = function(){
            var viewportSize = getViewportSize();
            var windowHorizontalCenter = viewportSize.width / 2;
            var windowVerticalCenter = viewportSize.height / 2;
            var divHorizontalOffset = divWidth / 2;
            var divVerticalOffset = divHeight / 2;
            return {
                "left": windowHorizontalCenter - divHorizontalOffset,
                "top": windowVerticalCenter - divVerticalOffset
            };
        };

        var playForcedFocusAnimation = function(){
            delay(addUnfocusedStateToDiv, forcedFocusAnimationDelay)
            .delay(removeUnfocusedStateToDiv, forcedFocusAnimationDelay)
            .delay(addUnfocusedStateToDiv, forcedFocusAnimationDelay)
            .delay(removeUnfocusedStateToDiv, forcedFocusAnimationDelay)
            .delay(addUnfocusedStateToDiv, forcedFocusAnimationDelay)
            .delay(removeUnfocusedStateToDiv, forcedFocusAnimationDelay);
        };

        var addUnfocusedStateToDiv = function(){
            div.classList.add('draggable-window--state-unfocused');
        };

        var removeUnfocusedStateToDiv = function(){
            div.classList.remove('draggable-window--state-unfocused');
        };

        return {
            display: display,
            addMouseDownEventListenerToTitleBar: addMouseDownEventListenerToTitleBar,
            playForcedFocusAnimation: playForcedFocusAnimation,
            onMouseUpEvent: onMouseUpEvent,
            onMouseMoveEvent: onMouseMoveEvent,
            onWindowResizeEvent: onWindowResizeEvent
        };
    }());

    return draggableWindow;
});