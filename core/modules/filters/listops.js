/*\
title: $:/core/modules/filters/listops.js
type: application/javascript
module-type: filteroperator

Filter operators for manipulating the current selection list

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Return the number the str represents
Return 1 if it's not a number
*/
function getInt( str ) {
	var i= parseInt( str );
	return isNaN(i) ? 1 : i;
}

/*
Order a list
*/
exports.order = function(source,operator,options) {
	var results = [];
	if(operator.operand.toLowerCase() === "reverse") {
		source(function(tiddler,title) {
			results.unshift(title);
		});
	} else {
		source(function(tiddler,title) {
			results.push(title);
		});
	}
	return results;
};

/*
Reverse list
*/
exports.reverse = function(source,operator,options) {
	var results = [];
	source(function(tiddler,title) {
		results.unshift(title);
	});
	return results;
};

/*
First entry/entries in list
*/
exports.first = function(source,operator,options) {
	var count = getInt(operator.operand),
		results = [];
	source(function(tiddler,title) {
		results.push(title);
	});
	return results.slice(0,count);
};

/*
Last entry/entries in list
*/
exports.last = function(source,operator,options) {
	var count = getInt(operator.operand),
		results = [];
	source(function(tiddler,title) {
		results.push(title);
	});
	return results.slice(-count);
};

/*
All but the first entry/entries of the list
*/
exports.rest = function(source,operator,options) {
	var count = getInt(operator.operand),
		results = [];
	source(function(tiddler,title) {
		results.push(title);
	});
	return results.slice(count);
};
exports.butfirst = exports.rest;
exports.bf = exports.rest;

/*
All but the last entry/entries of the list
*/
exports.butlast = function(source,operator,options) {
	var count = getInt(operator.operand),
		results = [];
	source(function(tiddler,title) {
		results.push(title);
	});
	return results.slice(0,-count);
};
exports.bl = exports.butlast;

/*
The nth member of the list
*/
exports.nth = function(source,operator,options) {
	var count = getInt(operator.operand),
		results = [];
	source(function(tiddler,title) {
		results.push(title);
	});
	return results.slice(count - 1,count);
};

})();
