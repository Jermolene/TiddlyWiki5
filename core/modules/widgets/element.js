/*\
title: $:/core/modules/widgets/element.js
type: application/javascript
module-type: widget

Element widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ElementWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ElementWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ElementWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Neuter blacklisted elements
	this.tag = this.parseTreeNode.tag;
	if($tw.config.htmlUnsafeElements.indexOf(this.tag) !== -1) {
		this.tag = "safe-" + this.tag;
	}
	// Adjust headings by the current base level
	var headingLevel = ["h1","h2","h3","h4","h5","h6"].indexOf(this.tag);
	if(headingLevel !== -1) {
		var baseLevel = parseInt(this.getVariable("tv-adjust-heading-level","0"),10) || 0;
		headingLevel = Math.min(Math.max(headingLevel + 1 + baseLevel,1),6);
		this.tag = "h" + headingLevel;
	}
	// Select the namespace for the tag
	var tagNamespaces = {
			svg: "http://www.w3.org/2000/svg",
			math: "http://www.w3.org/1998/Math/MathML",
			body: "http://www.w3.org/1999/xhtml"
		};
	this.namespace = tagNamespaces[this.tag];
	if(this.namespace) {
		this.setVariable("namespace",this.namespace);
	} else {
		this.namespace = this.getVariable("namespace",{defaultValue: "http://www.w3.org/1999/xhtml"});
	}
	// Invoke the th-rendering-element hook
	var parseTreeNodes = $tw.hooks.invokeHook("th-rendering-element",null,this);
	this.isReplaced = !!parseTreeNodes;
	if(parseTreeNodes) {
		// Use the parse tree nodes provided by the hook
		this.makeChildWidgets(parseTreeNodes);
		this.renderChildren(this.parentDomNode,null);
		return;
	}
	// Make the child widgets
	this.makeChildWidgets();
	// Create the DOM node and render children
	var domNode = this.document.createElementNS(this.namespace,this.tag);
	this.assignAttributes(domNode,{excludeEventAttributes: true});
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	if(this.focusOnRender) {
		domNode.focus();
	}
	this.domNodes.push(domNode);
};

ElementWidget.prototype.execute = function() {
	this.focusOnRender = this.getAttribute("focus-on-render","no") === "yes";
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ElementWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes(),
		hasChangedAttributes = $tw.utils.count(changedAttributes) > 0;
	if(hasChangedAttributes) {
		if(!this.isReplaced) {
			// Update our attributes
			this.assignAttributes(this.domNodes[0],{excludeEventAttributes: true});
		} else {
			// If we were replaced then completely refresh ourselves
			return this.refreshSelf();
		}
	}
	return this.refreshChildren(changedTiddlers) || hasChangedAttributes;
};

exports.element = ElementWidget;

})();
