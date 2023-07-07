/*\
title: $:/core/modules/filters/all/shadows.js
type: application/javascript
module-type: allfilteroperator

Filter function for [all[shadows]]

\*/


/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.shadows = function(source,prefix,options) {
	return options.wiki.allShadowTitles();
};

