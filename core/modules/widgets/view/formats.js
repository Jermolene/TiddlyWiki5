/*\
title: $:/core/modules/widgets/view/formats.js
type: application/javascript
module-type: viewwidgetformat

All the core View Widget formats.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.text = function(text) {
	return text;
};

exports.htmlwikified = function(text,widget,mode,template) {
	return widget.wiki.renderText("text/html","text/vnd.tiddlywiki",text,{
		parseAsInline: mode !== "block",
		parentWidget: widget
	});
};

exports.plainwikified = function(text,widget,mode,template) {
	return widget.wiki.renderText("text/plain","text/vnd.tiddlywiki",text,{
		parseAsInline: mode !== "block",
		parentWidget: widget
	});
};

exports.htmlencodedplainwikified = function(text,widget,mode,template) {
	return $tw.utils.htmlEncode(widget.wiki.renderText("text/plain","text/vnd.tiddlywiki",text,{
		parseAsInline: mode !== "block",
		parentWidget: widget
	}));
};

exports.htmlencoded = $tw.utils.htmlEncode;

exports.urlencoded = encodeURIComponent;

exports.doubleurlencoded = function(text) {
	return encodeURIComponent(encodeURIComponent(text));
};

exports.date = function(text,widget,mode,format) {
	format = format || "YYYY MM DD 0hh:0mm";
	var value = $tw.utils.parseDate(text);
	if(value && $tw.utils.isDate(value) && value.toString() !== "Invalid Date") {
		return $tw.utils.formatDateString(value,format);
	} else {
		return "";
	}
};

exports.relativedate = function(text) {
	var value = $tw.utils.parseDate(text);
	if(value && $tw.utils.isDate(value) && value.toString() !== "Invalid Date") {
		return $tw.utils.getRelativeDate((new Date()) - (new Date(value))).description;
	} else {
		return "";
	}
};

exports.stripcomments = function(text) {
	var lines = text.split("\n"),
		out = [];
	for(var line=0; line<lines.length; line++) {
		var text = lines[line];
		if(!/^\s*\/\/#/.test(text)) {
			out.push(text);
		}
	}
	return out.join("\n");
};

exports.jsencoded = function(text) {
	return $tw.utils.stringify(text);
};

})();
