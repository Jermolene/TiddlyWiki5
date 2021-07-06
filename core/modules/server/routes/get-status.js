/*\
title: $:/core/modules/server/routes/get-status.js
type: application/javascript
module-type: route

GET /status

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/status$/;

exports.handler = function(request,response,state) {
	var text = JSON.stringify({
		username: state.authenticatedUsername || state.server.get("anon-username") || "",
		anonymous: !state.authenticatedUsername,
		read_only: !state.server.isAuthorized("writers",state.authenticatedUsername),
		tiddlyweb_sse_enabled: state.server.get("tiddlyweb-sse-enabled") === "yes",
		space: {
			recipe: "default"
		},
		tiddlywiki_version: $tw.version
	});
	state.sendResponse(200,{"Content-Type": "application/json"},text,"utf8");
};

}());
