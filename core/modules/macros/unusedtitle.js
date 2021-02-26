/*\
title: $:/core/modules/macros/unusedtitle.js
type: application/javascript
module-type: macro

Macro to return a new title that is unused in the wiki. It can be given a name as a base.
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "unusedtitle";

exports.params = [
	{name: "baseName"},
	{name: "separator"}
];

/*
Run the macro
*/
exports.run = function(baseName, separator) {
	separator = separator || " ";
	if(!baseName) {
		baseName = $tw.language.getString("DefaultNewTiddlerTitle");
	}
	// $tw.wiki.generateNewTitle = function(baseTitle,options)
	// options.prefix must be a string! 
	return this.wiki.generateNewTitle(baseName, {"prefix": separator});
};

})();
