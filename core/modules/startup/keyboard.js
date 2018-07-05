/*\
title: $:/core/modules/startup/keyboard.js
type: application/javascript
module-type: startup

Keyboard shortcut handling

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "global-keyboard";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	if($tw.browser) {
		// Helper function to get a list of all shortcut tiddlers
		function getShortcutTiddlerList() {
			return $tw.wiki.getTiddlersWithTag("$:/tags/KeyboardShortcut");
		}
		// Get existing shortcut-tiddlers
		$tw.keyboardManager.shortcutTiddlers = getShortcutTiddlerList(),
		$tw.keyboardManager.shortcutKeysList = [], // Holds the shortcut-key descriptors
		$tw.keyboardManager.shortcutActionList = [], // Holds the corresponding action strings
		$tw.keyboardManager.shortcutParsedList = []; // Holds the parsed key descriptors

		function updateShortcutLists(tiddlerList) {
			$tw.keyboardManager.shortcutTiddlers = tiddlerList;
			for(var i=0; i < tiddlerList.length; i++) {
				var title = tiddlerList[i],
					tiddlerFields = $tw.wiki.getTiddler(title).fields;
				$tw.keyboardManager.shortcutKeysList[i] = tiddlerFields.key !== undefined ? tiddlerFields.key : undefined;
				$tw.keyboardManager.shortcutActionList[i] = tiddlerFields.text;
				$tw.keyboardManager.shortcutParsedList[i] = $tw.keyboardManager.shortcutKeysList[i] !== undefined ? $tw.keyboardManager.parseKeyDescriptors($tw.keyboardManager.shortcutKeysList[i]) : undefined;
			}
		};

		// Cache shortcuts and corresponding actions at startup
		updateShortcutLists($tw.keyboardManager.shortcutTiddlers);

		// Keydown Listener for shortcuts
		document.addEventListener("keydown",function(event) {
			var key, action;
			for(var i=0; i < $tw.keyboardManager.shortcutTiddlers.length; i++) {
				if($tw.keyboardManager.shortcutParsedList[i] !== undefined && $tw.keyboardManager.checkKeyDescriptors(event,$tw.keyboardManager.shortcutParsedList[i])) {
					key = $tw.keyboardManager.shortcutParsedList[i];
					action = $tw.keyboardManager.shortcutActionList[i];
				}
			}
			if(key !== undefined) {
				event.preventDefault();
				event.stopPropagation();
				$tw.rootWidget.invokeActionString(action,$tw.rootWidget);
				return true;
			}
			return false;
		},false);

		// Listener for changing shortcuts "on-the-fly"
		$tw.wiki.addEventListener("change",function(changes) {
			var newList = getShortcutTiddlerList();
			var hasChanged = false;

			// Returns true if a passed array contains a Tiddler that has changed
			function hasAnyTiddlerChanged(tiddlerList) {
				for(var i=0; i < tiddlerList.length; i++) {
					if($tw.utils.hop(changes,tiddlerList[i])) {
						return true;
					}
				}
				return false;
			};

			// First inspect the existing shortcut-tiddlers
			hasChanged = hasAnyTiddlerChanged($tw.keyboardManager.shortcutTiddlers);

			// Check if there are new shortcut-actions
			if(!hasChanged) {
				hasChanged = hasAnyTiddlerChanged(newList);
			}

			// Check if key-combinations have changed
			if(!hasChanged) {
				var shortcutConfigTiddlers = [],
					pattern = /^\$:\/config\/shortcuts\/.*$/;
				Object.keys(changes).forEach(function(configTiddler) {
					if(pattern.test(configTiddler)) {
						shortcutConfigTiddlers.push(configTiddler);
					}
				});
				hasChanged = hasAnyTiddlerChanged(shortcutConfigTiddlers);
			}

			// Re-cache shortcuts if something changed
			if(hasChanged) {
				updateShortcutLists(newList);
			}
		});
	}
};

})();
