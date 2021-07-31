/*\
title: $:/core/modules/widgets/password.js
type: application/javascript
module-type: widget

Password widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var PasswordWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
PasswordWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
PasswordWidget.prototype.render = function(parent,nextSibling) {
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Get the current password
	var password = $tw.browser ? $tw.utils.getPassword(this.passwordName) || "" : "";
	// Create our element
	var domNode = this.document.createElement("input");
	domNode.setAttribute("type","password");
	domNode.setAttribute("value",password);
	// Add a click event handler
	$tw.utils.addEventListeners(domNode,[
		{name: "change", handlerObject: this, handlerMethod: "handleChangeEvent"}
	]);
	this.domNode = domNode;
	// Assign classes
	this.assignDomNodeClasses();
	// Assign styles
	this.assignDomNodeStyles();
	// Insert the label into the DOM and render any children
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);
};

PasswordWidget.prototype.handleChangeEvent = function(event) {
	var password = this.domNodes[0].value;
	return $tw.utils.savePassword(this.passwordName,password);
};

/*
Compute the internal state of the widget
*/
PasswordWidget.prototype.execute = function() {
	// Get the parameters from the attributes
	this.passwordName = this.getAttribute("name","");
	// Make the child widgets
	this.makeChildWidgets();
};

PasswordWidget.prototype.assignDomNodeClasses = function() {
	var classes = this.getAttribute("class","").split(" ");
	this.domNode.className = classes.join(" ");
};

PasswordWidget.prototype.assignDomNodeStyles = function() {
	var styles = this.getAttribute("style");
	this.domNode.style = styles;
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
PasswordWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.name) {
		this.refreshSelf();
		return true;
	}
	if(changedAttributes["class"]) {
		this.assignDomNodeClasses();
	} if(changedAttributes["style"]) {
		this.assignDomNodeStyles();
	}
	return this.refreshChildren(changedTiddlers);
};

exports.password = PasswordWidget;

})();
