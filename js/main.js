/* jshint browser: true */

/* 

    Credit to:
        - jnoreiga@stackoverflow.com (https://stackoverflow.com/questions/9334084/moveable-draggable-div)
        - jfriend00@stackoverflow.com (https://stackoverflow.com/questions/6921275/is-it-possible-to-chain-settimeout-functions-in-javascript)

*/

var draggableWindow = function(){
    var displayDelay = 2000;
    var div = document.getElementById("draggable-window");
    var divTitleBarArea = document.getElementById("draggable-window__title-bar-area");
    var divHeight = 120;
    var divWidth = 354;
    var mousePosition;
    var offset = [0,0];
    var isDown = false;
    var userHasMovedTheDiv = false;
    var errorSound = document.getElementById("error-sound");
    var dingSound = document.getElementById("ding-sound");
    var forcedFocusAnimationDelay = 75;

    var init = function(){
        addEventListeners();
        setTimeout(function(){
            display();
            playErrorSound();
        }, displayDelay);
    };

    var addEventListeners = function(){
        addMouseDownEventListenerToTheWholePage();
        addMouseDownEventListenerToTitleBarArea();
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
        }, true);
    };

    var addWindowResizeEventListenerToTheWholePage = function(){
        window.onresize = function(){
            if(userHasMovedTheDiv){
                if(isDivOutsideOfTheViewport()){
                    centerDiv();
                }
            }else{
                centerDiv();
            }
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

    var getViewportSize = function(){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    };

    var moveDiv = function(left, top){
        div.style.left = left + "px";
        div.style.top  = top + "px";
    };

    var playErrorSound = function(){
        errorSound.play();
    };

    var playDingSound = function(){
        dingSound.play();
    };

    var display = function(){
        centerDiv();
        div.style.display = "block";
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
        playDingSound();
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
}();


function delay(fn, t) {
    // private instance variables
    var queue = [], self, timer;
    
    function schedule(fn, t) {
        timer = setTimeout(function() {
            timer = null;
            fn();
            if (queue.length) {
                var item = queue.shift();
                schedule(item.fn, item.t);
            }
        }, t);            
    }
    self = {
        delay: function(fn, t) {
            // if already queuing things or running a timer, 
            //   then just add to the queue
              if (queue.length || timer) {
                queue.push({fn: fn, t: t});
            } else {
                // no queue or timer yet, so schedule the timer
                schedule(fn, t);
            }
            return self;
        },
        cancel: function() {
            clearTimeout(timer);
            queue = [];
        }
    };
    return self.delay(fn, t);
}