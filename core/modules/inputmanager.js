/*\
title: $:/core/modules/inputmanager.js
type: application/javascript
module-type: global

global inputManager module $tw.inputManager
stores information about input and textarea fields in objects of the form
{
	id: "a unique id",
	selectionStart:"x",
	selectionEnd:"y",
	shouldFocusAgain:boolean
}

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var STATE_CURRENT_FOCUS = "$:/state/current-focus";

function InputManager(options) {
	options = options || {};
	this.wiki = options.wiki || $tw.wiki;
	// initialise the array that stores input information
	this.inputs = [];
}

/*
Find the input with the given identifier in the inputs array
Returns an "inputInfo" object of the form
{
	id: "a unique id",
	selectionStart:"x",
	selectionEnd:"y",
	shouldFocusAgain:boolean
}
*/
InputManager.prototype.findInputById = function(identifier) {
	var result;
	for(var i=0; i<this.inputs.length; i++) {
		var inputInfo = this.inputs[i];
		if(inputInfo["id"] === identifier) {
			result = inputInfo;
			break;
		}
	}
	return result;
};

/*
Returns the value of the inputInfo's "shouldFocusAgain" property
If an input gets focus the input engine calls $tw.inputManager.updateFocusInput(id) to set
its input as the one that should update again, because it's the last one that got focus
*/
InputManager.prototype.shouldFocusAgain = function(identifier) {
	var inputInfo = this.findInputById(identifier);
	if(inputInfo && inputInfo.shouldFocusAgain && (this.wiki.getTiddlerText(STATE_CURRENT_FOCUS) === identifier)) {
		return true;
	} else {
		return false;
	}
};

/*
A method used within the input engines to set / update values in its associated inputInfo object
*/
InputManager.prototype.setValue = function(identifier,name,value) {
	var inputInfo = this.findInputById(identifier);
	if(inputInfo) {
		inputInfo[name] = value;
	} else {
		var newInputInfo = {
			id: identifier
		};
		newInputInfo[name] = value;
		this.inputs.push(newInputInfo);
	}
};

/*
Returns an object of the form
{
	selectionStart: "x",
	selectionEnd: "y"
}
used within input engines to restore selections
*/
InputManager.prototype.getSelections = function(identifier) {
	var inputInfo = this.findInputById(identifier),
	    result;
	if(inputInfo) {
		result = {
			selectionStart: inputInfo.selectionStart,
			selectionEnd: inputInfo.selectionEnd
		};
	}
	return result;
};

/*
Updates all inputInfo objects within the inputs array so that only the input with
the given identifier has "shouldFocusAgain" set to true
*/
InputManager.prototype.updateFocusInput = function(identifier) {
	for(var i=0; i<this.inputs.length; i++) {
		var inputInfo = this.inputs[i];
		if(inputInfo["id"] === identifier) {
			inputInfo.shouldFocusAgain = true;
		} else {
			inputInfo.shouldFocusAgain = false;
		}
	}
};

exports.InputManager = InputManager;

})();
