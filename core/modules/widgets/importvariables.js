/*\
title: $:/core/modules/widgets/importvariables.js
type: application/javascript
module-type: widget

Import variable definitions from other tiddlers

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var ImportVariablesWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
ImportVariablesWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
ImportVariablesWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
ImportVariablesWidget.prototype.execute = function(tiddlerList) {
	var widgetPointer = this;
	// Got to flush all the accumulated variables
	this.variables = new this.variablesConstructor();
	// Get our parameters
	this.filter = this.getAttribute("filter");
	// Compute the filter
	this.tiddlerList = tiddlerList || this.wiki.filterTiddlers(this.filter,this);
	// Accumulate the <$set> widgets from each tiddler
	$tw.utils.each(this.tiddlerList,function(title) {
		var parser = widgetPointer.wiki.parseTiddler(title);
		if(parser) {
			var parseTreeNode = parser.tree[0];
			while(parseTreeNode && parseTreeNode.type === "set") {
				var node = {
					type: "set",
					attributes: parseTreeNode.attributes,
					params: parseTreeNode.params,
					isMacroDefinition: parseTreeNode.isMacroDefinition
				};
				if (parseTreeNode.isMacroDefinition) {
					// Macro definitions can be folded into
					// current widget instead of adding
					// another link to the chain.
					var widget = widgetPointer.makeChildWidget(node);
					widget.computeAttributes();
					widget.execute();
					// We SHALLOW copy over all variables
					// in widget. We can't use
					// $tw.utils.assign, because that copies
					// up the prototype chain, which we
					// don't want.
					$tw.utils.each(Object.keys(widget.variables), function(key) {
						widgetPointer.variables[key] = widget.variables[key];
					});
				} else {
					widgetPointer.children = [widgetPointer.makeChildWidget(node)];
					// No more regenerating children for
					// this widget. If it needs to refresh,
					// it'll do so along with the the whole
					// importvariable tree.
					if (widgetPointer != this) {
						widgetPointer.makeChildWidgets = function(){};
					}
					widgetPointer = widgetPointer.children[0];
				}
				parseTreeNode = parseTreeNode.children && parseTreeNode.children[0];
			}
		} 
	});

	if (widgetPointer != this) {
		widgetPointer.parseTreeNode.children = this.parseTreeNode.children;
	} else {
		widgetPointer.makeChildWidgets();
	}
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
ImportVariablesWidget.prototype.refresh = function(changedTiddlers) {
	// Recompute our attributes and the filter list
	var changedAttributes = this.computeAttributes(),
		tiddlerList = this.wiki.filterTiddlers(this.getAttribute("filter"),this);
	// Refresh if the filter has changed, or the list of tiddlers has changed, or any of the tiddlers in the list has changed
	function haveListedTiddlersChanged() {
		var changed = false;
		tiddlerList.forEach(function(title) {
			if(changedTiddlers[title]) {
				changed = true;
			}
		});
		return changed;
	}
	if(changedAttributes.filter || !$tw.utils.isArrayEqual(this.tiddlerList,tiddlerList) || haveListedTiddlersChanged()) {
		// Compute the filter
		this.removeChildDomNodes();
		this.execute(tiddlerList);
		this.renderChildren(this.parentDomNode,this.findNextSiblingDomNode());
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);		
	}
};

exports.importvariables = ImportVariablesWidget;

})();
