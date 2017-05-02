/*\
title: $:/plugins/tiddlywiki/mobiledragdrop/startup.js
type: application/javascript
module-type: startup

Startup initialisation

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "mobiledragdrop";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	window.addEventListener("touchmove", function() {});
};

})();
