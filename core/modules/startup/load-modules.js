/*\
title: $:/core/modules/startup/load-modules.js
type: application/javascript
module-type: startup

Load core modules

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "load-modules";
exports.synchronous = true;

exports.startup = function() {
	// Load modules
	$tw.modules.applyMethods("utils",$tw.utils);
	if($tw.node) {
		$tw.modules.applyMethods("utils-node",$tw.utils);
	}
	$tw.modules.applyMethods("global",$tw);
	$tw.modules.applyMethods("config",$tw.config);
	$tw.Tiddler.fieldModules = $tw.modules.getModulesByTypeAsHashmap("tiddlerfield");
	$tw.modules.applyMethods("tiddlermethod",$tw.Tiddler.prototype);
	$tw.modules.applyMethods("wikimethod",$tw.Wiki.prototype);
	$tw.modules.applyMethods("tiddlerdeserializer",$tw.Wiki.tiddlerDeserializerModules);
	var polyfills = $tw.modules.types["polyfill"];
	$tw.utils.each(polyfills,function(element,title) {
		$tw.modules.execute(title);
	});
	$tw.macros = $tw.modules.getModulesByTypeAsHashmap("macro");
	$tw.wiki.initParsers();
	$tw.Commander.initCommands();
};

})();
