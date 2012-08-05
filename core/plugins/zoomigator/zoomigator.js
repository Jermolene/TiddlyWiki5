/*\
title: $:/core/plugins/zoomigator/zoomigator.js
type: application/javascript
module-type: macro

Zooming navigator macro

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
	name: "zoomigator",
	params: {
	}
};

exports.startZoomigator = function(x,y) {
	this.inZoomigator = true;
	this.startX = x;
	this.startY = y;
	$tw.utils.addClass(document.body,"in-zoomigator");
};

/*
Zoom the body element given a touch/mouse position in screen coordinates
*/
exports.hoverZoomigator = function(x,y) {
	// Put the transform origin at the top in the middle
	document.body.style[$tw.browser.transformorigin] = "50% 0";
	// Some shortcuts
	this.bodyWidth = document.body.offsetWidth;
	this.bodyHeight = document.body.offsetHeight;
	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	// Compute the scale factor for fitting the entire page into the window. This is
	// the scale factor we'll use when the touch is far to the left
	this.minScale = this.windowHeight / this.bodyHeight;
	if(this.minScale < 0.1) {
		// Don't scale to less than 10% of original size
		this.minScale = 0.1;
	} else if(this.minScale > 1) {
		// Nor should we scale up if the body is shorter than the window
		this.minScale = 1;
	}
	// We divide the screen into two horizontal zones divided by the right edge of the body at maximum zoom (ie minimum scale)
	this.splitPos = this.windowWidth/2 + (this.bodyWidth * this.minScale)/2;
	// Compute the 0->1 ratio (from right to left) of the position of the touch within the right zone
	this.xFactor = (this.windowWidth - x) / (this.windowWidth - this.splitPos);
	if(this.xFactor > 1) {
		this.xFactor = 1;
	}
	// And the 0->1 ratio (from top to bottom) of the position of the touch down the screen
	this.yFactor = y/this.windowHeight;
	// Now interpolate the scale
	this.scale = (this.minScale - 1) * this.xFactor + 1;
	// Apply the transform. The malarkey with .toFixed() is because otherwise we might get numbers in
	// exponential notation (such as 5.1e-15) that are illegal in CSS
	var preTranslateY = window.scrollY * this.xFactor,
		scale = this.scale,
		postTranslateY = ((this.windowHeight / this.scale) - this.bodyHeight) * this.yFactor * this.xFactor;
	var transform = "translateY(" + preTranslateY.toFixed(8) + "px) " + 
			"scale(" + scale.toFixed(8) + ") " +
			"translateY(" + postTranslateY.toFixed(8) + "px)";
	document.body.style[$tw.browser.transform] = transform;
};

exports.stopZoomigator = function() {
	var newScrollY = this.yFactor * (this.bodyHeight - this.windowHeight);
	this.inZoomigator = false;
	window.scrollTo(0,newScrollY);
	document.body.style[$tw.browser.transform] = "translateY(" + newScrollY * this.xFactor + "px) " + 
		"scale(" + this.scale + ") " +
		"translateY(" + ((this.windowHeight / this.scale) - this.bodyHeight) * this.yFactor * this.xFactor + "px)";
	$tw.utils.removeClass(document.body,"in-zoomigator");
	document.body.style[$tw.browser.transform] = "translateY(0) scale(1) translateY(0)";
};

exports.handleEvent = function(event) {
	switch(event.type) {
		case "touchstart":
			this.startZoomigator(event.touches[0].clientX,event.touches[0].clientY);
			this.hoverZoomigator(event.touches[0].clientX,event.touches[0].clientY);
			event.preventDefault();
			return false;
		case "touchmove":
			this.hoverZoomigator(event.touches[0].clientX,event.touches[0].clientY);
			event.preventDefault();
			return false;
		case "touchend":
			this.stopZoomigator();
			event.preventDefault();
			return false;
	}
};

exports.executeMacro = function() {
	this.inZoomigator = false;
	var attributes = {
			style: {
				"position": "absolute",
				"right": "0",
				"top": "0",
				"min-width": "16px",
				"height": "100%" // Makes the height the same as the body, since the body is position:relative
			}
		};
	if(this.classes) {
		attributes["class"] = this.classes.slice(0);
	}
	return $tw.Tree.Element("div",attributes,[],{
		events: ["touchstart","touchmove","touchend"],
		eventHandler: this
	});
};

})();
