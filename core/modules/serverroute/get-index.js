/*\
title: $:/core/modules/serverroute/get-index.js
type: application/javascript
module-type: serverroute

GET /

\*/
(function() {
	module.exports = {
		method: "GET",
		path: /^\/$/,

		handler: function(request,response,state) {
			response.writeHead(200, {"Content-Type": state.server.get("serveType")});
			var text = state.wiki.renderTiddler(state.server.get("renderType"),state.server.get("rootTiddler"));
			response.end(text,"utf8");
		}
	};
}());
