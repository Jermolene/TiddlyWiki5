/*\
title: test-wikitext-parser.js
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests for wikitext parser

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

describe("WikiText parser tests", function() {

	// Create a wiki
	var wiki = new $tw.Wiki();

	// Define a parsing shortcut
	var parse = function(text) {
		return wiki.parseText("text/vnd.tiddlywiki",text).tree;
	};

	it("should parse linebreaks", function() {
		expect(parse("<br>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'br', isBlock : false, attributes : {  }, start : 0, end : 4 } ] } ]

		);
		expect(parse("</br>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'text', text : '</br>' } ] } ]

		);
	});

	it("should wrap elements in p´s", function() {
		expect(parse("<span></span>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'span', isBlock : false, attributes : {  }, children : [ ], start : 0, end : 6 } ] } ]

		);
		expect(parse("<span>some text</span>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'span', isBlock : false, attributes : {  }, children : [ { type : 'text', text : 'some text' } ], start : 0, end : 6 } ] } ]

		);
		expect(parse("<span>some text")).toEqual(parse("<span>some text</span>"));
	});

	it("should wrap elements in p´s, because of a linebreak escaper, which it skips", function() {
		expect(parse("<span>\\\nsome text\n</span>")).toEqual(

			[ { type : "element", tag : "p", children : [ { type : "element", tag : "span", isBlock : false, attributes : {}, children : [ { type : "text", text : "\nsome text\n" } ], start : 0, end : 6 } ] } ]

		);
		expect(parse("<span>\\some text</span>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'span', isBlock : false, attributes : {  }, children : [ { type : 'text', text : '\\some text' } ], start : 0, end : 6 } ] } ]

		);
	});

	it("should not wrap elements in p´s and parse their children in inline mode", function() {
		expect(parse("<div>\n</div>")).toEqual(

			[ { type : 'element', tag : 'div', isBlock : true, attributes : {  }, children: [ { type : 'text', text : '\n' } ], start : 0, end : 5 } ]

		);
		expect(parse("<div>\nsome text\n</div>")).toEqual(

			[ { type : 'element', tag : 'div', isBlock : true, attributes : {  }, children: [ { type : 'text', text : '\nsome text\n' } ], start : 0, end : 5 } ]

		);
		expect(parse("<div>\nsome text")).toEqual(parse("<div>\nsome text</div>"));
		expect(parse("<div>\n!i am not a heading\n</div>")).toEqual(

			[ { type : 'element', tag : 'div', isBlock : true, attributes : {  }, children: [ { type : 'text', text : '\n!i am not a heading\n' } ], start : 0, end : 5 } ]

		);
	});

	it("should not wrap pre/code elements in p´s and skip newlines before their children", function() {
		expect(parse("<pre>\nlet the linebreak avoid the p, then skip it\n</pre>")).toEqual(

			[ { type: "element", tag: "pre", isBlock: true, attributes: {}, children: [ { type: "text", text: "let the linebreak avoid the p, then skip it\n" } ], start: 0, end: 5 } ]

		);
		expect(parse("<pre>\n    but keep indents\n</pre>")).toEqual(

			[ { type: "element", tag: "pre", isBlock: true, attributes: {}, children: [ { type: "text", text: "    but keep indents\n" } ], start: 0, end: 5 } ]

		);
	});

	it("should not wrap elements in p´s and parse their children in block mode", function() {
		expect(parse("<div>\n\ni am inside a p\n\n</div>")).toEqual(

			[ { type : 'element', tag : 'div', start : 0, end : 5, isBlock : true, attributes : { }, children : [ { type : 'element', tag : 'p', children : [ { type : 'text', text : 'i am inside a p' } ] } ] } ]

		);
		expect(parse("<div>\n\n!i am a heading\n\n</div>")).toEqual(

			[ { type : 'element', tag : 'div', start : 0, end : 5, isBlock : true, attributes : { }, children : [ { type: "element", tag: "h1", attributes: { class: { type: "string", value: "" } }, children: [ { type: "text", text: "i am a heading" } ] } ] } ]

		);
	});

	it("should wrap and not wrap standalone elements in p´s", function() {
		expect(parse("<span/>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'span', isSelfClosing : true, isBlock : false, attributes : {  }, start : 0, end : 7 } ] } ]

		);
		expect(parse("<div/>\n")).toEqual(

			[ { type : 'element', tag : 'div', isBlock : true, isSelfClosing: true, attributes : {  }, start : 0, end : 6 } ]

		);
	});

	it("should parse tags with attributes", function() {
		expect(parse("<div attribute>some text</div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'div', isBlock : false, attributes : { attribute : { type : 'string', value : 'true', start : 4, end : 14, name: 'attribute' } }, children : [ { type : 'text', text : 'some text' } ], start : 0, end : 15 } ] } ]

		);
		expect(parse("<div attribute='value'>some text</div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'div', isBlock : false, attributes : { attribute : { type : 'string', name: 'attribute', value : 'value', start: 4, end: 22 } }, children : [ { type : 'text', text : 'some text' } ], start: 0, end: 23 } ] } ]

		);
		expect(parse("<div attribute={{TiddlerTitle}}>some text</div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'div', isBlock : false, attributes : { attribute : { type : 'indirect', name: 'attribute', textReference : 'TiddlerTitle', start : 4, end : 31 } }, children : [ { type : 'text', text : 'some text' } ], start : 0, end : 32 } ] } ]

		);
		expect(parse("<$reveal state='$:/temp/search' type='nomatch' text=''>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'reveal', tag: '$reveal', start : 0, attributes : { state : { start : 8, name : 'state', type : 'string', value : '$:/temp/search', end : 31 }, type : { start : 31, name : 'type', type : 'string', value : 'nomatch', end : 46 }, text : { start : 46, name : 'text', type : 'string', value : '', end : 54 } }, end : 55, isBlock : false, children : [  ] } ] } ]

		);
		expect(parse("<div attribute={{TiddlerTitle!!field}}>some text</div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'div', isBlock : false, attributes : { attribute : { type : 'indirect', name : 'attribute', textReference : 'TiddlerTitle!!field', start : 4, end : 38 } }, children : [ { type : 'text', text : 'some text' } ], start : 0, end : 39 } ] } ]

		);
		expect(parse("<div attribute={{Tiddler Title!!field}}>some text</div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', tag : 'div', isBlock : false, attributes : { attribute : { type : 'indirect', name : 'attribute', textReference : 'Tiddler Title!!field', start : 4, end : 39 } }, children : [ { type : 'text', text : 'some text' } ], start : 0, end : 40 } ] } ]

		);
		expect(parse("<div attribute={{TiddlerTitle!!field}}>\n\nsome text</div>")).toEqual(

			[ { type : 'element', start : 0, attributes : { attribute : { start : 4, name : 'attribute', type : 'indirect', textReference : 'TiddlerTitle!!field', end : 38 } }, tag : 'div', end : 39, isBlock : true, children : [ { type : 'element', tag : 'p', children : [ { type : 'text', text : 'some text' } ] } ] } ]

		);
		expect(parse("<div><div attribute={{TiddlerTitle!!field}}>\n\nsome text</div></div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', start : 0, attributes : {  }, tag : 'div', end : 5, isBlock : false, children : [ { type : 'element', start : 5, attributes : { attribute : { start : 9, name : 'attribute', type : 'indirect', textReference : 'TiddlerTitle!!field', end : 43 } }, tag : 'div', end : 44, isBlock : true, children : [ { type : 'element', tag : 'p', children : [ { type : 'text', text : 'some text' } ] } ] } ] } ] } ]

		);
		expect(parse("<div><div attribute={{TiddlerTitle!!field}}>\n\n!some heading</div></div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', start : 0, attributes : {  }, tag : 'div', end : 5, isBlock : false, children : [ { type : 'element', start : 5, attributes : { attribute : { start : 9, name : 'attribute', type : 'indirect', textReference : 'TiddlerTitle!!field', end : 43 } }, tag : 'div', end : 44, isBlock : true, children : [ { type : 'element', tag : 'h1', attributes : { class : { type : 'string', value : '' } }, children : [ { type : 'text', text : 'some heading</div></div>' } ] } ] } ] } ] } ]

		);
		expect(parse("<div><div attribute={{TiddlerTitle!!field}}>\n!some heading</div></div>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'element', start : 0, attributes : {  }, tag : 'div', end : 5, isBlock : false, children : [ { type : 'element', start : 5, attributes : { attribute : { start : 9, name : 'attribute', type : 'indirect', textReference : 'TiddlerTitle!!field', end : 43 } }, tag : 'div', end : 44, isBlock : false, children : [ { type : 'text', text : '\n!some heading' } ] } ] } ] } ]

		);
	});

	it("should parse macro definitions", function() {
		expect(parse("\\define myMacro()\nnothing\n\\end\n")).toEqual(

			[ { type : 'set', attributes : { name : { type : 'string', value : 'myMacro' }, value : { type : 'string', value : 'nothing' } }, children : [  ], params : [  ], isMacroDefinition : true } ]

		);

	});

	it("should parse macro calls", function() {
		expect(parse("<<john>><<paul>><<george>><<ringo>>")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'macrocall', name : 'john', params : [  ] }, { type : 'macrocall', name : 'paul', params : [  ] }, { type : 'macrocall', name : 'george', params : [  ] }, { type : 'macrocall', name : 'ringo', params : [  ] } ] } ]

		);

	});

	it("should parse horizontal rules", function() {
		expect(parse("---Not a rule\n\n----\n\nBetween\n\n---")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'entity', entity : '&mdash;' }, { type : 'text', text : 'Not a rule' } ] }, { type : 'element', tag : 'hr' }, { type : 'element', tag : 'p', children : [ { type : 'text', text : 'Between' } ] }, { type : 'element', tag : 'hr' } ]

		);

	});

	it("should parse hard linebreak areas", function() {
		expect(parse("\"\"\"Something\nin the\nway she moves\n\"\"\"\n\n")).toEqual(

			[ { type : 'element', tag : 'p', children : [ { type : 'text', text : 'Something' }, { type : 'element', tag : 'br' }, { type : 'text', text : 'in the' }, { type : 'element', tag : 'br' }, { type : 'text', text : 'way she moves' }, { type : 'element', tag : 'br' } ] } ]

		);

	});

});

})();
