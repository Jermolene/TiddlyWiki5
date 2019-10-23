/*\
title: $:/core/modules/widgets/subclasses/edit-text-subclass.js
type: application/javascript
module-type: widget-subclass

A subclass that intercepts the refresh method of edit-text widgets for enhanced refreshing

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.baseClass = "edit-text";

exports.constructor = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

exports.prototype = {};

// Configuration tiddlers
var HEIGHT_MODE_TITLE = "$:/config/TextEditor/EditorHeight/Mode";
var ENABLE_TOOLBAR_TITLE = "$:/config/TextEditor/EnableToolbar";

exports.prototype.execute = function(event) {
	// Call the base class execute function
	Object.getPrototypeOf(Object.getPrototypeOf(this)).execute.call(this,event);
	this.refreshTiddler = this.getAttribute("refreshTiddler");
	this.refreshAction = this.getAttribute("refreshAction");
	this.saveTiddler = this.getAttribute("saveTiddler");
};

exports.prototype.refresh = function(event) {
	var cA = this.computeAttributes();

	if(cA.refreshTiddler || cA.refreshAction || cA.saveTiddler) {
		this.refreshSelf();
		return true;
	} else if(!cA.tiddler && !cA.field && !cA.index && !cA["default"] && !cA["class"] && !cA.placeholder && !cA.size && !cA.autoHeight && !cA.minHeight && !cA.focusPopup && !cA.rows && !cA.tabindex && !event[HEIGHT_MODE_TITLE] && !event[ENABLE_TOOLBAR_TITLE]) {

		var refreshCondition = this.getAttribute("refreshCondition");
		if(this.refreshTiddler && event[this.refreshTiddler] && (refreshCondition === "true" || refreshCondition === "yes")) {
			this.engine.domNode.value = this.getEditInfo().value;
			this.wiki.deleteTiddler(this.refreshTiddler);
		} else if(event[this.editTitle] && (event[this.editTitle].deleted !== true)) {
			if(!event[this.refreshTiddler] && refreshCondition !== "true" && refreshCondition !== "yes") {
				//update the saveTiddler with the new text
				var saveTiddler = this.wiki.getTiddler(this.saveTiddler),
					updateFields = {
						title: this.saveTiddler
					};
				updateFields[this.editField] = this.getEditInfo().value;
				this.wiki.addTiddler(new $tw.Tiddler(this.wiki.getCreationFields(),saveTiddler,updateFields,this.wiki.getModificationFields()));
			}
		}
	}

	// Call the base class refresh function
	Object.getPrototypeOf(Object.getPrototypeOf(this)).refresh.call(this,event);

	};

})();
