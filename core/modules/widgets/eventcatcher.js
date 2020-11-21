/*\
title: $:/core/modules/widgets/eventcatcher.js
type: application/javascript
module-type: widget

Event handler widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var EventWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
EventWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
EventWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var tag = this.parseTreeNode.isBlock ? "div" : "span";
	if(this.elementTag && $tw.config.htmlUnsafeElements.indexOf(this.elementTag) === -1) {
		tag = this.elementTag;
	}	
	var domNode = this.document.createElement(tag);
	this.domNode = domNode;
	// Assign classes
	this.assignDomNodeClasses();	
	// Add our event handler
	domNode.addEventListener(this.type,function(event) {
		var selector = self.getAttribute("selector"),
			actions = self.getAttribute("actions"),
			selectedNode = event.target,
			variables = {};
		if(selector) {
			// Search ancestors for a node that matches the selector
			while(!selectedNode.matches(selector) && selectedNode !== domNode) {
				selectedNode = selectedNode.parentNode;
			}
			// If we found one, copy the attributes as variables, otherwise exit
			if(selectedNode.matches(selector)) {
				$tw.utils.each(selectedNode.attributes,function(attribute) {
					variables["dom-" + attribute.name] = attribute.value;
				});
				//Add a variable with a popup coordinate string for the selected node
				variables["tv-popup-coords"] = "(" + selectedNode.offsetLeft + "," + selectedNode.offsetTop +"," + selectedNode.offsetWidth + "," + selectedNode.offsetHeight + ")";
				
			} else {
				return false;
			}
		}
		// Execute our actions with the variables
		if(actions) {
			// Add a variable for the modifier key
			variables.modifier = $tw.keyboardManager.getEventModifierKeyDescriptor(event);
			// Add a variable for the mouse button
			if(event.button === 0) {
				variables["event-mousebutton"] = "left";
			} else if(event.button === 1) {
				variables["event-mousebutton"] = "middle";
			} else if(event.button === 2) {
				variables["event-mousebutton"] = "right";
			}
			self.invokeActionString(actions,self,event,variables);
			event.preventDefault();
			event.stopPropagation();
			return true;
		}
		return false;
	},false);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);	
};

/*
Compute the internal state of the widget
*/
EventWidget.prototype.execute = function() {
	var self = this;
	// Get attributes that require a refresh on change
	this.type = this.getAttribute("type");
	this.elementTag = this.getAttribute("tag");
	// Make child widgets
	this.makeChildWidgets();
};

EventWidget.prototype.assignDomNodeClasses = function() {
	var classes = this.getAttribute("class","").split(" ");
	classes.push("tc-eventcatcher");
	this.domNode.className = classes.join(" ");	
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
EventWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.type) {
		this.refreshSelf();
		return true;
	} else if(changedAttributes["class"]) {
		this.assignDomNodeClasses();
	}
	return this.refreshChildren(changedTiddlers);
};

exports.eventcatcher = EventWidget;

})();