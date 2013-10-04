/*\
title: $:/core/modules/widgets/transclude.js
type: application/javascript
module-type: new_widget

Transclude widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var TranscludeWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
TranscludeWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
TranscludeWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
TranscludeWidget.prototype.execute = function() {
	// Get our parameters
	this.transcludeTitle = this.getAttribute("title",this.getVariable("tiddlerTitle"));
	this.transcludeField = this.getAttribute("field");
	this.transcludeIndex = this.getAttribute("index");
	// Check for recursion
	var recursionMarker = "{" + this.transcludeTitle + "|" + this.transcludeField + "|" + this.transcludeIndex + "}";
	if(this.parentWidget && this.parentWidget.hasVariable("transclusion",recursionMarker)) {
		this.makeChildWidgets([{type: "text", text: "Tiddler recursion error in transclude widget"}]);
		return;
	}
	// Set context variables for recursion detection
	this.setVariable("transclusion",recursionMarker);
	// Parse the text reference
	var parser = this.wiki.new_parseTextReference(
						this.transcludeTitle,
						this.transcludeField,
						this.transcludeIndex,
						{parseAsInline: true}),
		parseTreeNodes = parser ? parser.tree : [];
	// Construct the child widgets
	this.makeChildWidgets(parseTreeNodes);
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
TranscludeWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.title || changedAttributes.field || changedAttributes.index || changedTiddlers[this.transcludeTitle]) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

exports.transclude = TranscludeWidget;

})();
