/* jshint browser: true */

var draggableWindow = function(){
	var displayDelay = 2500;
	var domElement = document.getElementById("draggable-window");

	var init = function(){
		setTimeout(display, displayDelay);
	};

	var display = function(){
		domElement.style.display = "block";
	};

	init();
}();