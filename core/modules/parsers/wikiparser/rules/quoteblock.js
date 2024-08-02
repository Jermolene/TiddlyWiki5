/*\
title: $:/core/modules/parsers/wikiparser/rules/quoteblock.js
type: application/javascript
module-type: wikirule

Wiki text rule for quote blocks.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "quoteblock";
exports.types = {block: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /(<<<+)/mg;
};

exports.parse = function() {
	var classes = ["tc-quote"];
	// Get all the details of the match
	var reEndString = "^\\s*" + this.match[1] + "(?!<)";
	// Move past the <s
	this.parser.pos = this.matchRegExp.lastIndex;
	// Parse any classes, whitespace and then the optional cite itself
	var classStart = this.parser.pos;
	classes.push.apply(classes, this.parser.parseClasses());
	var classEnd = this.parser.pos;
	this.parser.skipWhitespace({treatNewlinesAsNonWhitespace: true});
	var citeStart = this.parser.pos;
	var cite = this.parser.parseInlineRun(/(\r?\n)/mg);
	var citeEnd = this.parser.pos;
	// before handling the cite, parse the body of the quote
	var tree = this.parser.parseBlocks(reEndString);
	// If we got a cite, put it before the text
	if(cite.length > 0) {
		tree.unshift({
			type: "element",
			tag: "cite",
			children: cite,
			start: citeStart,
			end: citeEnd
		});
	}
	// Parse any optional cite
	this.parser.skipWhitespace({treatNewlinesAsNonWhitespace: true});
	citeStart = this.parser.pos;
	cite = this.parser.parseInlineRun(/(\r?\n)/mg);
	citeEnd = this.parser.pos;
	// If we got a cite, push it
	if(cite.length > 0) {
		tree.push({
			type: "element",
			tag: "cite",
			children: cite,
			start: citeStart,
			end: citeEnd
		});
	}
	// Return the blockquote element
	return [{
		type: "element",
		tag: "blockquote",
		attributes: {
			class: { type: "string", value: classes.join(" "), start: classStart, end: classEnd },
		},
		children: tree
	}];
};

exports.serialize = function(tree, serialize) {
	// tree: { type: 'element', tag: 'blockquote', attributes: { class: { type: 'string', value: 'tc-quote' } }, children: [{ type: 'text', text: 'Quote text' }] }
	// serialize: function that accepts array of nodes or a node and returns a string
	// Split the class attribute value into an array of classes, classes: ['tc-quote']
	var classes = tree.attributes.class.value.split(" ");
	// Start the serialized string with the opening delimiter and classes, serialized: '<<<tc-quote\n'
	var serialized = "<<<" + classes.join(" ") + "\n";
	// Serialize the children of the blockquote, serialized: '<<<tc-quote\nQuote text'
	serialized += serialize(tree.children);
	// Return the complete serialized string with the closing delimiter, serialized: '<<<tc-quote\nQuote text\n<<<'
	return serialized + "\n<<<";
};

})();
