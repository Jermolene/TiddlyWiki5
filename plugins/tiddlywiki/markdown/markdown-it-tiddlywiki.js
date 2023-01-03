/*\
title: $:/plugins/tiddlywiki/markdown/markdown-it-tiddlywiki.js
type: application/javascript
module-type: library

Wraps up the markdown-it parser for use as a Parser in TiddlyWiki

\*/
(function(){
/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var md;

var TWMarkReplacements = {
	"{{"  : "&#123;&#123;",
	"$:/" : "&#36;:/"
};
var TWMarkRegEx = /{{|\$:\//g;

function encodeTWMark(match) {
	return TWMarkReplacements[match];
}

// escpae "{{" and "$:/" in string s
function escapeTWMarks(s) {
	s = String(s);
	TWMarkRegEx.lastIndex = 0;
	return s.replace(TWMarkRegEx,encodeTWMark);
}

/// special handling for code spans and code blocks ///

// escape anything that could be interpreted as transclusion or syslink
function render_code_inline(tokens,idx,options,env,slf) {
	tokens[idx].attrJoin("class","_codified_");
	return  '<code' + slf.renderAttrs(tokens[idx]) + '>' +
			escapeTWMarks(md.utils.escapeHtml(tokens[idx].content)) +
			'</code>';
};

function render_code_block(tokens,idx,options,env,slf) {
	return  '<$codeblock code=e"' + md.utils.escapeHtml(tokens[idx].content) + '" language=""/>\n';
};

function render_fence(tokens,idx,options,env,slf) {
	var info = tokens[idx].info ? md.utils.unescapeAll(tokens[idx].info).trim() : '';
	return '<$codeblock code=e"' + md.utils.escapeHtml(tokens[idx].content) + '" language="' + info.split(/(\s+)/g)[0] + '"/>\n';
};

/// add a blank line after <p> to activate TW block parsing ///

function render_paragraph_open(tokens,idx,options/*,env*/) {
	return tokens[idx].hidden ? '' : '<p>\n\n';
};

function render_paragraph_close(tokens,idx,options/*,env*/) {
	return tokens[idx].hidden ? '' : '\n</p>\n';
};

/// Replace footnote links with "qualified" internal links ///

function render_footnote_ref(tokens,idx,options,env,slf) {
	var id      = slf.rules.footnote_anchor_name(tokens,idx,options,env,slf);
	var caption = slf.rules.footnote_caption(tokens,idx,options,env,slf);
	var refid   = id;

	if(tokens[idx].meta.subId > 0) {
		refid += ':' + tokens[idx].meta.subId;
	}
	return '<a class="footnote-ref" href=<<qualify "##fn' + id + '">> id=<<qualify "#fnref' + refid + '">>>' + caption + '</a>';
};

function render_footnote_open(tokens,idx,options,env,slf) {
	var id = slf.rules.footnote_anchor_name(tokens,idx,options,env,slf);

	if(tokens[idx].meta.subId > 0) {
		id += ':' + tokens[idx].meta.subId;
	}
	return '<li id=<<qualify "#fn' + id + '">>  class="footnote-item">';
};

function render_footnote_anchor(tokens,idx,options,env,slf) {
	var id = slf.rules.footnote_anchor_name(tokens,idx,options,env,slf);

	if(tokens[idx].meta.subId > 0) {
		id += ':' + tokens[idx].meta.subId;
	}

	// append variation selector to prevent display as Apple Emoji on iOS
	return '<a href=<<qualify "##fnref' + id + '">> class="footnote-backref">\u21A5\uFE0E</a>';
};

/// Add inline rule "macrocall" to parse <<macroname ...>> ///

var MacroCallRegEx = /\s*<<([^\s>"'=]+)[^>]*>>/g;
function macrocall_inline(state,silent) {
	var match, max, pos = state.pos;

	if(!state.md.options.html) { return false; }

	// Check start
	max = state.posMax;
	if(state.src.charCodeAt(pos) !== 0x3C || state.src.charCodeAt(pos+1) !== 0x3C /* << */||
		pos + 3 >= max) {
		return false;
	}

	MacroCallRegEx.lastIndex = pos;
	match = MacroCallRegEx.exec(state.src);
	if(!match) { return false; }

	if(!silent) {
		var token = state.push('macrocall','',0);
		token.content = state.src.slice(pos,pos+match[0].length);
	}
	state.pos += match[0].length;
	return true;
}

function render_macrocall(tokens,idx) {
	return tokens[idx].content;
}

// based on markdown-it html_block()
var WidgetTagRegExp = [/^<\/?\$[a-zA-Z0-9\-\$]+(?=(\s|\/?>|$))/, /^$/];
function tw_block(state,startLine,endLine,silent) {
	var i, nextLine, token, lineText,
		pos = state.bMarks[startLine] + state.tShift[startLine],
		max = state.eMarks[startLine];

	// if it's indented more than 3 spaces, it should be a code block
	if(state.sCount[startLine] - state.blkIndent >= 4) { return false; }

	if(!state.md.options.html) { return false; }

	if(state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

	lineText = state.src.slice(pos,max);

	if(!WidgetTagRegExp[0].test(lineText)) { return false; }

	if(silent) {
		// true if this sequence can be a terminator, false otherwise
		return true;
	}

	nextLine = startLine + 1;

	// If we are here - we detected HTML block.
	// Let's roll down till block end.
	if(!WidgetTagRegExp[1].test(lineText)) {
		for(; nextLine < endLine; nextLine++) {
			if(state.sCount[nextLine] < state.blkIndent) { break; }

			pos = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			lineText = state.src.slice(pos,max);

			if(WidgetTagRegExp[1].test(lineText)) {
				if(lineText.length !== 0) { nextLine++; }
				break;
			}
		}
	}

	state.line = nextLine;

	token         = state.push('html_block','',0);
	token.map     = [ startLine, nextLine ];
	token.content = state.getLines(startLine,nextLine,state.blkIndent,true);

	return true;
}

/// post processing ///

function wikify(state) {
	var href, title, src, alt, replaceTag = undefined;

	state.tokens.forEach(function(blockToken) {
		if(blockToken.type === 'inline' && blockToken.children) {
			blockToken.children.forEach(function(token) {
				switch(token.type) {
				case "link_open":
					href = token.attrGet("href");
					if(href[0] === "#") {
						replaceTag = "$link";
						href = $tw.utils.decodeURIComponentSafe(href.substring(1));
						title = token.attrGet("title");
						token.attrs = [["to", href], ["class", "_codified_"]];
						if(title) {
							token.attrSet("tooltip",title);
						}
						token.tag = replaceTag;
					} else {
						replaceTag = undefined;
						token.attrSet("target","_blank");
						token.attrJoin("class","tc-tiddlylink-external");
						token.attrJoin("class","_codified_");
						token.attrSet("rel","noopener noreferrer");
					}
					break;
				case "link_close":
					if(replaceTag) {
						token.tag = replaceTag;
						replaceTag = undefined;
					}
					break;
				case "image":
					token.tag = "$image";
					src = token.attrGet("src");
					alt = token.attrGet("alt");
					title = token.attrGet("title");

					token.attrs[token.attrIndex('src')][0] = "source";
					if(src[0] === "#") {
						src = $tw.utils.decodeURIComponentSafe(src.substring(1));
						token.attrSet("source",src);
					}
					if(title) {
						token.attrs[token.attrIndex('title')][0] = "tooltip";
					}
					break;
				}
			});
		}
	});
};

var TWCloseTagRegEx = /<\/\$[A-Za-z0-9\-\$]+\s*>/gm;
function tiddlyWikiPlugin(markdown,options) {
	// Default options

	md = markdown;
	options = options || {};

	md.renderer.rules.code_inline = render_code_inline;
	md.renderer.rules.code_block = render_code_block;
	md.renderer.rules.fence = render_fence;
	md.renderer.rules.paragraph_open = render_paragraph_open;
	md.renderer.rules.paragraph_close = render_paragraph_close;
	md.renderer.rules.footnote_ref = render_footnote_ref;
	md.renderer.rules.footnote_open = render_footnote_open;
	md.renderer.rules.footnote_anchor = render_footnote_anchor;

	var html_inline = (function(origRule) {
		return function(state,silent) {
			if(origRule(state,silent)) {
				return true;
			}

			var token, pos = state.pos;
			var parseTag = $tw.Wiki.parsers["text/vnd.tiddlywiki"].prototype.inlineRuleClasses.html.prototype.parseTag;
			var tag = parseTag(state.src,pos,{});
			if(tag) {
				if(!silent) {
					token = state.push('html_inline','',0);
					token.content = state.src.slice(pos,tag.end);
				}
				state.pos = tag.end;
				return true;
			}

			TWCloseTagRegEx.lastIndex = pos;
			var match = TWCloseTagRegEx.exec(state.src);
			if(!match) {
				return false;
			}

			if(!silent) {
				token = state.push('html_inline','',0);
				token.content = state.src.slice(pos,pos + match[0].length);
			}
			state.pos += match[0].length;
			return true;
		}
	})(md.inline.ruler.__rules__[md.inline.ruler.__find__("html_inline")].fn);

	if(options.renderWikiText) {
		md.renderer.rules.macrocall = render_macrocall;
		md.inline.ruler.before("html_inline","macrocall",macrocall_inline);
		md.inline.ruler.at("html_inline",html_inline);
		md.block.ruler.after("html_block","tw_block",tw_block,{
			alt: [ 'paragraph', 'reference', 'blockquote' ]
		});
	}

	md.core.ruler.push('wikify',wikify);
}

module.exports = tiddlyWikiPlugin;
})();
