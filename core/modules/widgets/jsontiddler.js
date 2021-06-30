/*\
title: $:/core/modules/widgets/jsontiddler.js
type: application/javascript
module-type: widget

Render a tiddler as JSON text

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var JSONTiddlerWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
JSONTiddlerWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
JSONTiddlerWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Collect the fields from the optional base tiddler
	var fields = {};
	if(this.attTiddler) {
	var tiddler = this.wiki.getTiddler(this.attTiddler);
		if(tiddler) {
			fields = tiddler.getFieldStrings({exclude: this.attExclude.split(" ")});
		}
	}
	// Add custom fields specified in attributes starting with $
	$tw.utils.each(this.attributes,function(attribute,name) {
		if(name.charAt(0) === "$") {
			fields[name.slice(1)] = attribute;
		}
	});
	// JSONify
	var json = JSON.stringify(fields);
	// Escape unsafe script characters
	if(this.attEscapeUnsafeScriptChars) {
		json = json.replace(/</g,"\\x3C");
	}
	// Update the DOM
	var textNode = this.document.createTextNode(json);
	parent.insertBefore(textNode,nextSibling);
	this.domNodes.push(textNode);
};

/*
Compute the internal state of the widget
*/
JSONTiddlerWidget.prototype.execute = function() {
	this.attTiddler = this.getAttribute("tiddler");
	this.attExclude = this.getAttribute("exclude","");
	this.attEscapeUnsafeScriptChars = this.getAttribute("escapeUnsafeScriptChars","no") === "yes";
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
JSONTiddlerWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if($tw.utils.count(changedAttributes) > 0 || (this.attTiddler && changedTiddlers[this.attTiddler])) {
	this.refreshSelf();
		return true;
	} else {
		return false;
	}
};

exports.jsontiddler = JSONTiddlerWidget;

})();