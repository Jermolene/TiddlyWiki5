/*\
title: $:/core/modules/serverroute/put-tiddler.js
type: application/javascript
module-type: serverroute

PUT /recipes/default/tiddlers/:title

\*/
(function() {
	module.exports = {
		method: "PUT",
		path: /^\/recipes\/default\/tiddlers\/(.+)$/,

		handler: function(request,response,state) {
			var title = decodeURIComponent(state.params[0]),
			fields = JSON.parse(state.data);
			// Pull up any subfields in the `fields` object
			if(fields.fields) {
				$tw.utils.each(fields.fields,function(field,name) {
					fields[name] = field;
				});
				delete fields.fields;
			}
			// Remove any revision field
			if(fields.revision) {
				delete fields.revision;
			}
			state.wiki.addTiddler(new $tw.Tiddler(state.wiki.getCreationFields(),fields,{title: title},state.wiki.getModificationFields()));
			var changeCount = state.wiki.getChangeCount(title).toString();
			response.writeHead(204, "OK",{
				Etag: "\"default/" + encodeURIComponent(title) + "/" + changeCount + ":\"",
				"Content-Type": "text/plain"
			});
			response.end();
		}
	};
}());
