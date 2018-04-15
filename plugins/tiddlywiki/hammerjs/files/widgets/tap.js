/*\
title: $:/plugins/tiddlywiki/hammerjs/widgets/tap.js
type: application/javascript
module-type: widget

actions triggered on taps&clicks

\*/
(function (global) {

"use strict";
/*jslint node: true, browser: true */
/*global $tw: false */

var Widget = require("$:/core/modules/widgets/widget.js").widget;

if (typeof window !== 'undefined') {
	var Hammer = require("$:/plugins/tiddlywiki/hammerjs/hammer.js");
}

var TapWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
TapWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
TapWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	var parentDomNode = parent;

	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	
	if (self === this && parent !== undefined && nextSibling !== undefined) {
		self.renderChildren(parent,nextSibling);
	} else if (self === this) {
		self.refresh();
		parentDomNode = parent;
	} else {
		return false;
	}

	if(this.tapTargets === undefined || this.tapTargets === "") {
		return false;
	}

	var tapElementClass;
	var tapMultipleClasses = null;
	if(this.tapTargets.indexOf(' ') !== -1) {
		tapMultipleClasses = true;
		tapElementClass = self.tapTargets.split(' ');
	} else {
		tapElementClass = self.tapTargets;
	}

	if(tapElementClass === undefined || tapElementClass === "" || parentDomNode === undefined) {
		return false;
	}

	var domNodeList = [];
	if (tapMultipleClasses === true) {
		for (var i=0; i < tapElementClass.length; i++) {
			var tapElements = parentDomNode.getElementsByClassName(tapElementClass[i]);
			for (var k=0; k < tapElements.length; k++) {
				domNodeList[i + k] = tapElements[k];
				self.domNodes.push(tapElements[k]);
			}
		}
	} else {
		domNodeList = parentDomNode.getElementsByClassName(tapElementClass);
		self.domNodes.push(domNodeList);
	}

	var tapElementIndex;

	for(i=0; i < domNodeList.length; i++) {
		tapElementIndex = i;

		var hammer = new Hammer.Manager(domNodeList[i]);

		hammer.add(new Hammer.Tap({
			event: 'usertap',
			pointers: self.tapPointers,
			taps: self.tapCount,
			interval: self.tapInterval,
			time: self.tapTime,
			threshold: self.tapThreshold,
			posThreshold: self.tapPosThreshold
		}));

		hammer.get('usertap');

		hammer.on('usertap', function(e) {

			if(self.tapActions) {
				self.invokeActionString(self.tapActions,self,e);
			}

			if (self.parentWidget !== undefined && self.domNodes[0] !== undefined && self.domNodes[0].parentNode !== undefined) {
				self.parentWidget.refreshSelf();
			}
			return true; // Action was invoked
		});
	}
};

/*
Compute the internal state of the widget
*/
TapWidget.prototype.execute = function() {
	this.tapTargets = this.getAttribute("targets");
	this.tapCount = parseInt(this.getAttribute("taps","1"));
	this.tapPointers = parseInt(this.getAttribute("pointers","1"));
	this.tapThreshold = parseInt(this.getAttribute("threshold","100"));
	this.tapPosThreshold = parseInt(this.getAttribute("posthreshold","200"));
	this.tapTime = parseInt(this.getAttribute("time","250"));
	this.tapInterval = parseInt(this.getAttribute("interval","300"));
	this.tapActions = this.getAttribute("actions","");
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
TapWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.tap = TapWidget;
})();