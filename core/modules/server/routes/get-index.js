/*\
title: $:/core/modules/server/routes/get-index.js
type: application/javascript
module-type: route

GET /

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/index.html$/;

exports.handler = function(request,response,state) {
	var text = state.wiki.renderTiddler(state.server.get("root-render-type"),state.server.get("root-tiddler")),
		responseHeaders = {
		"Content-Type": state.server.get("root-serve-type")
	};
	state.sendResponse(200,responseHeaders,text);
};

}());
