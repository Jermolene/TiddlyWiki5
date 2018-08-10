/*\
title: $:/core/modules/server/routes/get-tiddler-html.js
type: application/javascript
module-type: route

GET /:title

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/view\/([^\/]+)$/;

exports.handler = function(request,response,state) {
	var title = decodeURIComponent(state.params[0]),
		tiddler = state.wiki.getTiddler(title);
	if(tiddler) {
        var renderType = tiddler.getFieldString("_render_type"),
            renderTemplate = tiddler.getFieldString("_render_template");
        // Tiddler fields '_render_type' and '_render_template' overwrite
        // system wide settings for render type and template
		if(state.wiki.isSystemTiddler(title)) {
			renderType = renderType || state.server.get("system-tiddler-render-type");
			renderTemplate = renderTemplate || state.server.get("system-tiddler-render-template");
		} else {
			renderType = renderType || state.server.get("tiddler-render-type");
			renderTemplate = renderTemplate || state.server.get("tiddler-render-template");
		}
		var text = state.wiki.renderTiddler(renderType,renderTemplate,{parseAsInline: true, variables: {currentTiddler: title}});
		// Naughty not to set a content-type, but it's the easiest way to ensure the browser will see HTML pages as HTML, and accept plain text tiddlers as CSS or JS
		response.writeHead(200);
		response.end(text,"utf8");
	} else {
		response.writeHead(404);
		response.end();
	}
};

}());
