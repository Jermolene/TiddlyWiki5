/*\
title: $:/core/modules/serverroute/get-tiddlers-json.js
type: application/javascript
module-type: serverroute

GET /recipes/default/tiddlers/tiddlers.json

\*/
(function() {
	module.exports = {
		method: "GET",
		path: /^\/recipes\/default\/tiddlers.json$/,

		handler: function(request,response,state) {
			response.writeHead(200, {"Content-Type": "application/json"});
			var tiddlers = [];
			state.wiki.forEachTiddler({sortField: "title"},function(title,tiddler) {
				var tiddlerFields = {};
				$tw.utils.each(tiddler.fields,function(field,name) {
					if(name !== "text") {
						tiddlerFields[name] = tiddler.getFieldString(name);
					}
				});
				tiddlerFields.revision = state.wiki.getChangeCount(title);
				tiddlerFields.type = tiddlerFields.type || "text/vnd.tiddlywiki";
				tiddlers.push(tiddlerFields);
			});
			var text = JSON.stringify(tiddlers);
			response.end(text,"utf8");
		}
	};
}());
