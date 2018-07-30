
; (function () {

	/**
	 * Require the module at `name`.
	 *
	 * @param {String} name
	 * @return {Object} exports
	 * @api public
	 */

	function require(name) {
		var module = require.modules[name];
		if (!module) throw new Error('failed to require "' + name + '"');

		if (!('exports' in module) && typeof module.definition === 'function') {
			module.client = module.component = true;
			module.definition.call(this, module.exports = {}, module);
			delete module.definition;
		}

		return module.exports;
	}

	/**
	 * Meta info, accessible in the global scope unless you use AMD option.
	 */

	require.loader = 'component';

	/**
	 * Internal helper object, contains a sorting function for semantiv versioning
	 */
	require.helper = {};
	require.helper.semVerSort = function (a, b) {
		var aArray = a.version.split('.');
		var bArray = b.version.split('.');
		for (var i = 0; i < aArray.length; ++i) {
			var aInt = parseInt(aArray[i], 10);
			var bInt = parseInt(bArray[i], 10);
			if (aInt === bInt) {
				var aLex = aArray[i].substr(("" + aInt).length);
				var bLex = bArray[i].substr(("" + bInt).length);
				if (aLex === '' && bLex !== '') return 1;
				if (aLex !== '' && bLex === '') return -1;
				if (aLex !== '' && bLex !== '') return aLex > bLex ? 1 : -1;
				continue;
			} else if (aInt > bInt) {
				return 1;
			} else {
				return -1;
			}
		}
		return 0;
	}

	/**
	 * Find and require a module which name starts with the provided name.
	 * If multiple modules exists, the highest semver is used.
	 * This function can only be used for remote dependencies.
	
	 * @param {String} name - module name: `user~repo`
	 * @param {Boolean} returnPath - returns the canonical require path if true,
	 *                               otherwise it returns the epxorted module
	 */
	require.latest = function (name, returnPath) {
		function showError(name) {
			throw new Error('failed to find latest module of "' + name + '"');
		}
		// only remotes with semvers, ignore local files conataining a '/'
		var versionRegexp = /(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;
		var remoteRegexp = /(.*)~(.*)/;
		if (!remoteRegexp.test(name)) showError(name);
		var moduleNames = Object.keys(require.modules);
		var semVerCandidates = [];
		var otherCandidates = []; // for instance: name of the git branch
		for (var i = 0; i < moduleNames.length; i++) {
			var moduleName = moduleNames[i];
			if (new RegExp(name + '@').test(moduleName)) {
				var version = moduleName.substr(name.length + 1);
				var semVerMatch = versionRegexp.exec(moduleName);
				if (semVerMatch != null) {
					semVerCandidates.push({ version: version, name: moduleName });
				} else {
					otherCandidates.push({ version: version, name: moduleName });
				}
			}
		}
		if (semVerCandidates.concat(otherCandidates).length === 0) {
			showError(name);
		}
		if (semVerCandidates.length > 0) {
			var module = semVerCandidates.sort(require.helper.semVerSort).pop().name;
			if (returnPath === true) {
				return module;
			}
			return require(module);
		}
		// if the build contains more than one branch of the same module
		// you should not use this funciton
		var module = otherCandidates.sort(function (a, b) { return a.name > b.name })[0].name;
		if (returnPath === true) {
			return module;
		}
		return require(module);
	}

	/**
	 * Registered modules.
	 */

	require.modules = {};

	/**
	 * Register module at `name` with callback `definition`.
	 *
	 * @param {String} name
	 * @param {Function} definition
	 * @api private
	 */

	require.register = function (name, definition) {
		require.modules[name] = {
			definition: definition
		};
	};

	/**
	 * Define a module's exports immediately with `exports`.
	 *
	 * @param {String} name
	 * @param {Generic} exports
	 * @api private
	 */

	require.define = function (name, exports) {
		require.modules[name] = {
			exports: exports
		};
	};
	require.register("touchy", function (exports, module) {
		/**
		 * touchy.js
		 *
		 * A JavaScript microlibrary for UI interaction on mobile and desktop.
		 * Dispatches custom events to be used when normal events does not suffice.
		 *
		 * BROWSER SUPPORT: Safari, Chrome, Firefox, IE9, iOS4+, Android 4+
		 *
		 * @author     Stefan Liden
		 * @version    1.4.2
		 * @copyright  Copyright 2011-2016 Stefan Liden
		 * @license    MIT
		 */

		(function () {

			var d = document,
				isTouch = 'ontouchstart' in window,
				doubleTap = false,
				touchEvents = {
					start: 'touchstart',
					move: 'touchmove',
					end: 'touchend'
				},
				mouseEvents = {
					start: 'mousedown',
					move: 'mousemove',
					end: 'mouseup'
				},
				// http://jessefreeman.com/articles/from-webkit-to-windows-8-touch-events/
				msPointerEvents = {
					start: 'MSPointerDown',
					move: 'MSPointerMove',
					end: 'MSPointerUp'
				},
				// https://coderwall.com/p/mfreca/ie-11-in-windows-8-1-pointer-events-changes
				msIEElevenPointerEvents = {
					start: 'pointerdown',
					move: 'pointermove',
					end: 'pointerup'
				},
				evts = isTouch ? touchEvents : setEventType();

			// If this is not touch, is it a MS Pointer or a regular mouse device?
			function setEventType() {
				if (window.navigator.pointerEnabled) return msIEElevenPointerEvents;
				return window.navigator.msPointerEnabled ? msPointerEvents : mouseEvents;
			}

			// Dispatch new event
			// Chrome (61.0.3163.100) does not have an object at event.touches[0] for most events!
			function dispatchEvent(target, eventName, event) {
				var evt,
					touch = event;
				// Modern mobile browsers
				if (event.changedTouches) {
					touch = event.changedTouches[0];
				}
				// IE less than Edge
				else if (event.touches) {
					touch = event.touches[0];
				}
				// Modern browsers
				// try/catch is a Windows fix
				// https://github.com/davidtheclark/tap.js/commit/9d7638913be497278e173a4b14bea40f3891dbbd
				try {
					evt = new CustomEvent(eventName, {
						'detail': {
							'clientX': touch.clientX,
							'clientY': touch.clientY
						},
						cancelable: true,
						bubbles: true
					});
				} catch (e) {
					evt = document.createEvent('MouseEvent');
					evt.initEvent(eventName, true, true);
				}
				target.dispatchEvent(evt);
			}

			function onStart(event) {
				var startTime = new Date().getTime(),
					touch = event,
					nrOfFingers = isTouch ? event.touches.length : 1,
					startX, startY;
				var hasMoved = false;

				// Modern mobile browsers
				if (event.changedTouches) {
					touch = event.changedTouches[0];
				}
				// IE less than Edge
				else if (event.touches) {
					touch = event.touches[0];
				}

				// Prevent panning and zooming (IE)
				if (event.preventManipulation) event.preventManipulation();

				// See blog.msdn.com/b/ie/20111/10/19/handling-multi-touch-and-mouse-input-in-all-browsers.aspx
				if (typeof event.target.style.msTouchAction !== 'undefined') event.target.style.msTouchAction = 'none';

				startX = touch.clientX;
				startY = touch.clientY;

				d.addEventListener(evts.move, onMove, false);
				d.addEventListener(evts.end, onEnd, false);

				function onMove(e) {
					if (!hasMoved) {
						hasMoved = true;
						nrOfFingers = isTouch ? e.touches.length : 1;
					}
					dispatchEvent(e.target, 'drag', e);
				}

				function onEnd(e) {
					var endX, endY, diffX, diffY, dirX, dirY, absDiffX, absDiffY,
						ele = e.target,
						changed = e,
						swipeEvent = 'swipe',
						endTime = new Date().getTime(),
						timeDiff = endTime - startTime;


					// Modern mobile browsers
					if (e.changedTouches) {
						changed = e.changedTouches[0];
					}
					// IE less than Edge
					else if (e.touches) {
						changed = e.touches[0];
					}

					// Fix for IE always triggering onMove and not to count very small moves
					if (hasMoved) {
						endX = changed.clientX;
						endY = changed.clientY;
						diffX = endX - startX;
						diffY = endY - startY;
						// If the move is less than 10px, then we don't consider it a move
						if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
							hasMoved = false;
						}
					}

					// Taps
					if (!hasMoved) {
						if (nrOfFingers === 1) {
							if (timeDiff <= 500) {
								if (doubleTap) {
									dispatchEvent(ele, 'doubleTap', e);
								}
								else {
									dispatchEvent(ele, 'tap', e);
									doubleTap = true;
								}
								resetDoubleTap();
							}
							else {
								dispatchEvent(ele, 'longTouch', e);
							}
						}
						if (nrOfFingers === 2) {
							dispatchEvent(ele, 'twoFingerTap', e);
						}
						else if (nrOfFingers === 3) {
							dispatchEvent(ele, 'threeFingerTap', e);
						}
						else if (nrOfFingers === 4) {
							dispatchEvent(ele, 'fourFingerTap', e);
						}
					}
					// Swipes
					else {
						if (nrOfFingers === 1) {
							if (timeDiff < 300) {
								endX = endX || changed.clientX;
								endY = endY || changed.clientY;
								diffX = diffX || endX - startX;
								diffY = diffY || endY - startY;
								dirX = diffX > 0 ? 'right' : 'left';
								dirY = diffY > 0 ? 'down' : 'up';
								absDiffX = Math.abs(diffX);
								absDiffY = Math.abs(diffY);

								// If moving finger far, it's not a swipe
								if (absDiffX < 40 || absDiffY < 40) {
									if (absDiffX >= absDiffY) {
										swipeEvent += dirX;
									}
									else {
										swipeEvent += dirY;
									}

									dispatchEvent(ele, swipeEvent, e);
								}
							}
							else {
								dispatchEvent(ele, 'drop', e);
							}
						}
						// Simple multifinger swipes. No direction indicated
						if (nrOfFingers === 2) {
							dispatchEvent(ele, 'twoFingerSwipe', e);
						}
						else if (nrOfFingers === 3) {
							dispatchEvent(ele, 'threeFingerSwipe', e);
						}
						else if (nrOfFingers === 4) {
							dispatchEvent(ele, 'fourFingerSwipe', e);
						}
						// Event indicating other gesture. Use hammer.js for gesture events
						else {
							dispatchEvent(ele, 'gesture', e);
						}
					}

					d.removeEventListener(evts.move, onMove, false);
					d.removeEventListener(evts.end, onEnd, false);
				}
			}

			function resetDoubleTap() {
				setTimeout(function () { doubleTap = false; }, 400);
			}

			d.addEventListener(evts.start, onStart, false);

			// Deprecated.
			function stop(e) {
				if (e && e.bubbles) {
					e.stopPropagation();
				}
			}

			// Return an object to access useful properties and methods
			window.touchy = {
				isTouch: isTouch,
				stop: stop,
				events: evts
			};
		}());


	});

	if (typeof exports == "object") {
		module.exports = require("touchy");
	} else if (typeof define == "function" && define.amd) {
		define("touchy", [], function () { return require("touchy"); });
	} else {
		(this || window)["touchy"] = require("touchy");
	}
})()