/*\
title: $:/core/modules/filters/list.js
type: application/javascript
module-type: filteroperator

Filter operator returning the tiddlers whose title is listed in the operand tiddler

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.list = function(source,operator,options) {
	var results = [],
		tr = $tw.utils.parseTextReference(operator.operand),
		currTiddlerTitle = options.widget && options.widget.getVariable("currentTiddler"),
		list = options.wiki.getTiddlerList(tr.title || currTiddlerTitle,tr.field,tr.index);
	source(function(tiddler,title) {
		options.wiki.addResult(title,results,operator,list.indexOf(title) > -1);
	});
	return results;
};

})();
