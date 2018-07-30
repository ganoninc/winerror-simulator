/* 
    Credit to:
        - jnoreiga@stackoverflow.com (https://stackoverflow.com/questions/9334084/moveable-draggable-div)
*/

define(['delay'], function(delay){
    var draggableWindow = (function(){
        var mousePosition;
        var offset = [0,0];
        var forcedFocusAnimationDelay = 75;
        var isDown = false;

        var div = document.getElementById("draggable-window");
        var divTitleBarArea = document.getElementById("draggable-window__title-bar-area");
        var divHeight = 120;
        var divWidth = 354;
        var userHasMovedTheDiv = false;

        var init = function(){
            preloadUnfocusedState();
        };

        var preloadUnfocusedState = function(){
            delay(addUnfocusedStateToDiv, 0)
            .delay(removeUnfocusedStateToDiv, 25);
        };

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

        var onMouseMoveEvent = function(event){
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
                return true;
            }
            return false;
        };

        var addTouchDragEventListenerToTitleBar = function(){
            divTitleBarArea.addEventListener('drag', function (e) {
                if (!isDown){
                    offset = [
                        div.offsetLeft - e.detail.clientX,
                        div.offsetTop - e.detail.clientY
                    ];
                }
                isDown = true;

                mousePosition = {
                    x: event.detail.clientX,
                    y: event.detail.clientY
                };
                var viewportSize = getViewportSize();
                if (mousePosition.y > 2 && mousePosition.y < viewportSize.height - 2 && mousePosition.x > 2 && mousePosition.x < viewportSize.width - 2) {
                    var newDivCoordinates = {
                        left: (mousePosition.x + offset[0]),
                        top: (mousePosition.y + offset[1])
                    };
                    moveDiv(newDivCoordinates.left, newDivCoordinates.top);
                }
            });
        };

        var addTouchDropEventListenerToTitleBar = function(){
            divTitleBarArea.addEventListener('drop', function () {
                isDown = false;
            });
        };

        var onViewportResizeEvent = function(){
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
            var isDivVerticallyOutside = divCoordinates.y + 25 > viewportSize.height;
            var isDivHorizontallyOutside = divCoordinates.x + 25 > viewportSize.width;
            return isDivVerticallyOutside || isDivHorizontallyOutside;
        };

        var getDivCoordinates = function(){
            return{
                x: parseInt(div.style.left, 10),
                y: parseInt(div.style.top, 10)
            };
        };

        var getCoordinates = function(){
            return getDivCoordinates();
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

        init();

        return {
            display: display,
            addMouseDownEventListenerToTitleBar: addMouseDownEventListenerToTitleBar,
            playForcedFocusAnimation: playForcedFocusAnimation,
            onMouseUpEvent: onMouseUpEvent,
            onMouseMoveEvent: onMouseMoveEvent,
            addTouchDragEventListenerToTitleBar: addTouchDragEventListenerToTitleBar,
            addTouchDropEventListenerToTitleBar: addTouchDropEventListenerToTitleBar,
            onViewportResizeEvent: onViewportResizeEvent,
            getCoordinates: getCoordinates
        };
    }());

    return draggableWindow;
});