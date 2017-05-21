/*\
title: $:/core/modules/serverroute/get-tiddler.js
type: application/javascript
module-type: serverroute

GET /recipes/default/tiddlers/:title

\*/
(function() {
	module.exports = {
		method: "GET",
		path: /^\/recipes\/default\/tiddlers\/(.+)$/,

		handler: function(request,response,state) {
			var title = decodeURIComponent(state.params[0]),
				tiddler = state.wiki.getTiddler(title),
				tiddlerFields = {},
				knownFields = [
					"bag", "created", "creator", "modified", "modifier", "permissions", "recipe", "revision", "tags", "text", "title", "type", "uri"
				];
			if(tiddler) {
				$tw.utils.each(tiddler.fields,function(field,name) {
					var value = tiddler.getFieldString(name);
					if(knownFields.indexOf(name) !== -1) {
						tiddlerFields[name] = value;
					} else {
						tiddlerFields.fields = tiddlerFields.fields || {};
						tiddlerFields.fields[name] = value;
					}
				});
				tiddlerFields.revision = state.wiki.getChangeCount(title);
				tiddlerFields.type = tiddlerFields.type || "text/vnd.tiddlywiki";
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(JSON.stringify(tiddlerFields),"utf8");
			} else {
				response.writeHead(404);
				response.end();
			}
		}
	};
}());
