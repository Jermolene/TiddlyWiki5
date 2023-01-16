/*\
title: $:/core/modules/filters/debug-log.js
type: application/javascript
module-type: filteroperator

Filter operator for logging the current list and an optional variable value to the console

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports["debug-log"] = function(source,operator,options) {
	var results = [], data = {};

	if (operator.operand)
		data[operator.operand] = options.widget.getVariable(operator.operand,{defaultValue:""});

	source(function(tiddler,title) {
		results.push(title);
	});

	console.group("debug-log");
	$tw.utils.logTable(results);
	if (operator.operand) $tw.utils.logTable(data);
	console.groupEnd();

	return results;
};

})();
