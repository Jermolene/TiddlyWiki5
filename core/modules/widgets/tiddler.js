/*\
title: $:/core/modules/widgets/tiddler.js
type: application/javascript
module-type: widget

Tiddler widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var TiddlerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListener("tw-active-focus", "handleFocusEvent");
	this.activeState = false;
};

/*
Inherit from the base widget class
*/
TiddlerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
TiddlerWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
TiddlerWidget.prototype.execute = function() {
	// Get our parameters
	this.tiddlerTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	// Set context variables
	this.setVariable("currentTiddler",this.tiddlerTitle);
	this.setVariable("missingTiddlerClass",(this.wiki.tiddlerExists(this.tiddlerTitle) || this.wiki.isShadowTiddler(this.tiddlerTitle)) ? "tw-tiddler-exists" : "tw-tiddler-missing");
	this.setVariable("shadowTiddlerClass",this.wiki.isShadowTiddler(this.tiddlerTitle) ? "tw-tiddler-shadow" : "");
	this.setVariable("systemTiddlerClass",this.wiki.isSystemTiddler(this.tiddlerTitle) ? "tw-tiddler-system" : "");
	this.setVariable("tiddlerTagClasses",this.getTagClasses())
	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Create a string of CSS classes derived from the tags of the current tiddler
*/
TiddlerWidget.prototype.getTagClasses = function() {
	var tiddler = this.wiki.getTiddler(this.tiddlerTitle);
	if(tiddler) {
		var tags = [];
		$tw.utils.each(tiddler.fields.tags,function(tag) {
			tags.push("tw-tagged-" + encodeURIComponent(tag));
		});
		return tags.join(" ");
	} else {
		return "";
	}
};


TiddlerWidget.prototype.handleFocusEvent = function(event) {
	//check event and set our active state
	if(event.type == "tw-active-focus") {
		this.activeState = (event.param == "false") ? false : true;
		// don't propagate any further
		return false;
	}

	return true;
}

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
TiddlerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler || (changedTiddlers[this.tiddlerTitle] && !this.activeState)) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

exports.tiddler = TiddlerWidget;

})();
