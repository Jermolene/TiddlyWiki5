/*\
title: $:/core/modules/commands/init.js
type: application/javascript
module-type: command

Command to initialise an empty wiki folder

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.info = {
	name: "init",
	synchronous: true
};

var Command = function(params,commander) {
	this.params = params;
	this.commander = commander;
};

Command.prototype.execute = function() {
	var fs = require("fs"),
		path = require("path");
	// Check that we don't already have a valid wiki folder
	if(this.commander.wiki.wikiTiddlersPath || ($tw.utils.isDirectory(this.commander.wiki.wikiPath) && !$tw.utils.isDirectoryEmpty(this.commander.wiki.wikiPath))) {
		return "Wiki folder is not empty";
	}
	// Loop through each of the specified editions
	var editions = this.params.length > 0 ? this.params : ["empty"];
	for(var editionIndex=0; editionIndex<editions.length; editionIndex++) {
		var editionName = editions[editionIndex];
		// Check the edition exists
		var editionPath = $tw.findLibraryItem(editionName,$tw.getLibraryItemSearchPaths($tw.config.editionsPath,$tw.config.editionsEnvVar));
		if(!$tw.utils.isDirectory(editionPath)) {
			return "Edition '" + editionName + "' not found";
		}
		// Copy the edition content
		var err = $tw.utils.copyDirectory(editionPath,this.commander.wiki.wikiPath);
		if(!err) {
			this.commander.streams.output.write("Copied edition '" + editionName + "' to " + this.commander.wiki.wikiPath + "\n");
		} else {
			return err;
		}
	}
	// Tweak the tiddlywiki.info to remove any included wikis
	var packagePath = this.commander.wiki.wikiPath + "/tiddlywiki.info",
		packageJson = JSON.parse(fs.readFileSync(packagePath));
	delete packageJson.includeWikis;
	fs.writeFileSync(packagePath,JSON.stringify(packageJson,null,$tw.config.preferences.jsonSpaces));
	return null;
};

exports.Command = Command;

})();
