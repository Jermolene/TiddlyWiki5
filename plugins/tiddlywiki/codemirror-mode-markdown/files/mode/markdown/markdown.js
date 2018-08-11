// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("../xml/xml"),require("../tw-meta")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../xml/xml","../meta"],t):t(CodeMirror)}(function(t){"use strict";t.defineMode("markdown",function(e,i){var n=t.getMode(e,"text/html"),r="null"==n.name;void 0===i.highlightFormatting&&(i.highlightFormatting=!1),void 0===i.maxBlockquoteDepth&&(i.maxBlockquoteDepth=0),void 0===i.taskLists&&(i.taskLists=!1),void 0===i.strikethrough&&(i.strikethrough=!1),void 0===i.emoji&&(i.emoji=!1),void 0===i.fencedCodeBlockHighlighting&&(i.fencedCodeBlockHighlighting=!0),void 0===i.xml&&(i.xml=!0),void 0===i.tokenTypeOverrides&&(i.tokenTypeOverrides={});var a={header:"header",code:"comment",quote:"quote",list1:"variable-2",list2:"variable-3",list3:"keyword",hr:"hr",image:"image",imageAltText:"image-alt-text",imageMarker:"image-marker",formatting:"formatting",linkInline:"link",linkEmail:"link",linkText:"link",linkHref:"string",em:"em",strong:"strong",strikethrough:"strikethrough",emoji:"builtin"};for(var l in a)a.hasOwnProperty(l)&&i.tokenTypeOverrides[l]&&(a[l]=i.tokenTypeOverrides[l]);var o=/^([*\-_])(?:\s*\1){2,}\s*$/,h=/^(?:[*\-+]|^[0-9]+([.)]))\s+/,g=/^\[(x| )\](?=\s)/i,s=i.allowAtxHeaderWithoutSpace?/^(#+)/:/^(#+)(?: |$)/,m=/^ *(?:\={1,}|-{1,})\s*$/,u=/^[^#!\[\]*_\\<>` "'(~:]+/,f=/^(~~~+|```+)[ \t]*([\w+#-]*)[^\n`]*$/,c=/^\s*\[[^\]]+?\]:.*$/,d=/[!\"#$%&\'()*+,\-\.\/:;<=>?@\[\\\]^_`{|}~—]/;function k(t,e,i){return e.f=e.inline=i,i(t,e)}function p(t,e,i){return e.f=e.block=i,i(t,e)}function x(t){return t.linkTitle=!1,t.linkHref=!1,t.linkText=!1,t.em=!1,t.strong=!1,t.strikethrough=!1,t.quote=0,t.indentedCode=!1,t.f==S&&(t.f=M,t.block=v),t.trailingSpace=0,t.trailingSpaceNewLine=!1,t.prevLine=t.thisLine,t.thisLine={stream:null},null}function v(n,r){var l,u=n.column()===r.indentation,d=!(l=r.prevLine.stream)||!/\S/.test(l.string),p=r.indentedCode,x=r.prevLine.hr,v=!1!==r.list,S=(r.listStack[r.listStack.length-1]||0)+3;r.indentedCode=!1;var q=r.indentation;if(null===r.indentationDiff&&(r.indentationDiff=r.indentation,v)){for(r.em=!1,r.strong=!1,r.code=!1,r.strikethrough=!1,r.list=null;q<r.listStack[r.listStack.length-1];)r.listStack.pop(),r.listStack.length?r.indentation=r.listStack[r.listStack.length-1]:r.list=!1;!1!==r.list&&(r.indentationDiff=q-r.listStack[r.listStack.length-1])}var M=!(d||x||r.prevLine.header||v&&p||r.prevLine.fencedCodeEnd),F=(!1===r.list||x||d)&&r.indentation<=S&&n.match(o),b=null;if(r.indentationDiff>=4&&(p||r.prevLine.fencedCodeEnd||r.prevLine.header||d))return n.skipToEnd(),r.indentedCode=!0,a.code;if(n.eatSpace())return null;if(u&&r.indentation<=S&&(b=n.match(s))&&b[1].length<=6)return r.quote=0,r.header=b[1].length,r.thisLine.header=!0,i.highlightFormatting&&(r.formatting="header"),r.f=r.inline,T(r);if(r.indentation<=S&&n.eat(">"))return r.quote=u?1:r.quote+1,i.highlightFormatting&&(r.formatting="quote"),n.eatSpace(),T(r);if(!F&&!r.setext&&u&&r.indentation<=S&&(b=n.match(h))){var E=b[1]?"ol":"ul";return r.indentation=q+n.current().length,r.list=!0,r.quote=0,r.listStack.push(r.indentation),i.taskLists&&n.match(g,!1)&&(r.taskList=!0),r.f=r.inline,i.highlightFormatting&&(r.formatting=["list","list-"+E]),T(r)}return u&&r.indentation<=S&&(b=n.match(f,!0))?(r.quote=0,r.fencedEndRE=new RegExp(b[1]+"+ *$"),r.localMode=i.fencedCodeBlockHighlighting&&function(i){if(t.findModeByName){var n=t.findModeByName(i);n&&(i=n.mime||n.mimes[0])}var r=t.getMode(e,i);return"null"==r.name?null:r}(b[2]),r.localMode&&(r.localState=t.startState(r.localMode)),r.f=r.block=L,i.highlightFormatting&&(r.formatting="code-block"),r.code=-1,T(r)):r.setext||!(M&&v||r.quote||!1!==r.list||r.code||F||c.test(n.string))&&(b=n.lookAhead(1))&&(b=b.match(m))?(r.setext?(r.header=r.setext,r.setext=0,n.skipToEnd(),i.highlightFormatting&&(r.formatting="header")):(r.header="="==b[0].charAt(0)?1:2,r.setext=r.header),r.thisLine.header=!0,r.f=r.inline,T(r)):F?(n.skipToEnd(),r.hr=!0,r.thisLine.hr=!0,a.hr):"["===n.peek()?k(n,r,w):k(n,r,r.inline)}function S(e,i){var a=n.token(e,i.htmlState);if(!r){var l=t.innerMode(n,i.htmlState);("xml"==l.mode.name&&null===l.state.tagStart&&!l.state.context&&l.state.tokenize.isInText||i.md_inside&&e.current().indexOf(">")>-1)&&(i.f=M,i.block=v,i.htmlState=null)}return a}function L(t,e){var n,r=e.listStack[e.listStack.length-1]||0,l=e.indentation<r,o=r+3;return e.fencedEndRE&&e.indentation<=o&&(l||t.match(e.fencedEndRE))?(i.highlightFormatting&&(e.formatting="code-block"),l||(n=T(e)),e.localMode=e.localState=null,e.block=v,e.f=M,e.fencedEndRE=null,e.code=0,e.thisLine.fencedCodeEnd=!0,l?p(t,e,e.block):n):e.localMode?e.localMode.token(t,e.localState):(t.skipToEnd(),a.code)}function T(t){var e=[];if(t.formatting){e.push(a.formatting),"string"==typeof t.formatting&&(t.formatting=[t.formatting]);for(var n=0;n<t.formatting.length;n++)e.push(a.formatting+"-"+t.formatting[n]),"header"===t.formatting[n]&&e.push(a.formatting+"-"+t.formatting[n]+"-"+t.header),"quote"===t.formatting[n]&&(!i.maxBlockquoteDepth||i.maxBlockquoteDepth>=t.quote?e.push(a.formatting+"-"+t.formatting[n]+"-"+t.quote):e.push("error"))}if(t.taskOpen)return e.push("meta"),e.length?e.join(" "):null;if(t.taskClosed)return e.push("property"),e.length?e.join(" "):null;if(t.linkHref?e.push(a.linkHref,"url"):(t.strong&&e.push(a.strong),t.em&&e.push(a.em),t.strikethrough&&e.push(a.strikethrough),t.emoji&&e.push(a.emoji),t.linkText&&e.push(a.linkText),t.code&&e.push(a.code),t.image&&e.push(a.image),t.imageAltText&&e.push(a.imageAltText,"link"),t.imageMarker&&e.push(a.imageMarker)),t.header&&e.push(a.header,a.header+"-"+t.header),t.quote&&(e.push(a.quote),!i.maxBlockquoteDepth||i.maxBlockquoteDepth>=t.quote?e.push(a.quote+"-"+t.quote):e.push(a.quote+"-"+i.maxBlockquoteDepth)),!1!==t.list){var r=(t.listStack.length-1)%3;r?1===r?e.push(a.list2):e.push(a.list3):e.push(a.list1)}return t.trailingSpaceNewLine?e.push("trailing-space-new-line"):t.trailingSpace&&e.push("trailing-space-"+(t.trailingSpace%2?"a":"b")),e.length?e.join(" "):null}function q(t,e){if(t.match(u,!0))return T(e)}function M(e,r){var l=r.text(e,r);if(void 0!==l)return l;if(r.list)return r.list=null,T(r);if(r.taskList)return" "===e.match(g,!0)[1]?r.taskOpen=!0:r.taskClosed=!0,i.highlightFormatting&&(r.formatting="task"),r.taskList=!1,T(r);if(r.taskOpen=!1,r.taskClosed=!1,r.header&&e.match(/^#+$/,!0))return i.highlightFormatting&&(r.formatting="header"),T(r);var o=e.next();if(r.linkTitle){r.linkTitle=!1;var h=o;"("===o&&(h=")");var s="^\\s*(?:[^"+(h=(h+"").replace(/([.?*+^\[\]\\(){}|-])/g,"\\$1"))+"\\\\]+|\\\\\\\\|\\\\.)"+h;if(e.match(new RegExp(s),!0))return a.linkHref}if("`"===o){var m=r.formatting;i.highlightFormatting&&(r.formatting="code"),e.eatWhile("`");var u=e.current().length;if(0!=r.code||r.quote&&1!=u){if(u==r.code){var f=T(r);return r.code=0,f}return r.formatting=m,T(r)}return r.code=u,T(r)}if(r.code)return T(r);if("\\"===o&&(e.next(),i.highlightFormatting)){var c=T(r),k=a.formatting+"-escape";return c?c+" "+k:k}if("!"===o&&e.match(/\[[^\]]*\] ?(?:\(|\[)/,!1))return r.imageMarker=!0,r.image=!0,i.highlightFormatting&&(r.formatting="image"),T(r);if("["===o&&r.imageMarker&&e.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/,!1))return r.imageMarker=!1,r.imageAltText=!0,i.highlightFormatting&&(r.formatting="image"),T(r);if("]"===o&&r.imageAltText){i.highlightFormatting&&(r.formatting="image");var c=T(r);return r.imageAltText=!1,r.image=!1,r.inline=r.f=b,c}if("["===o&&!r.image)return r.linkText=!0,i.highlightFormatting&&(r.formatting="link"),T(r);if("]"===o&&r.linkText){i.highlightFormatting&&(r.formatting="link");var c=T(r);return r.linkText=!1,r.inline=r.f=e.match(/\(.*?\)| ?\[.*?\]/,!1)?b:M,c}if("<"===o&&e.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/,!1))return r.f=r.inline=F,i.highlightFormatting&&(r.formatting="link"),(c=T(r))?c+=" ":c="",c+a.linkInline;if("<"===o&&e.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/,!1))return r.f=r.inline=F,i.highlightFormatting&&(r.formatting="link"),(c=T(r))?c+=" ":c="",c+a.linkEmail;if(i.xml&&"<"===o&&e.match(/^(!--|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*>)/i,!1)){var x=e.string.indexOf(">",e.pos);if(-1!=x){var v=e.string.substring(e.start,x);/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(v)&&(r.md_inside=!0)}return e.backUp(1),r.htmlState=t.startState(n),p(e,r,S)}if(i.xml&&"<"===o&&e.match(/^\/\w*?>/))return r.md_inside=!1,"tag";if("*"===o||"_"===o){for(var L=1,q=1==e.pos?" ":e.string.charAt(e.pos-2);L<3&&e.eat(o);)L++;var E=e.peek()||" ",w=!/\s/.test(E)&&(!d.test(E)||/\s/.test(q)||d.test(q)),j=!/\s/.test(q)&&(!d.test(q)||/\s/.test(E)||d.test(E)),y=null,C=null;if(L%2&&(r.em||!w||"*"!==o&&j&&!d.test(q)?r.em!=o||!j||"*"!==o&&w&&!d.test(E)||(y=!1):y=!0),L>1&&(r.strong||!w||"*"!==o&&j&&!d.test(q)?r.strong!=o||!j||"*"!==o&&w&&!d.test(E)||(C=!1):C=!0),null!=C||null!=y){i.highlightFormatting&&(r.formatting=null==y?"strong":null==C?"em":"strong em"),!0===y&&(r.em=o),!0===C&&(r.strong=o);f=T(r);return!1===y&&(r.em=!1),!1===C&&(r.strong=!1),f}}else if(" "===o&&(e.eat("*")||e.eat("_"))){if(" "===e.peek())return T(r);e.backUp(1)}if(i.strikethrough)if("~"===o&&e.eatWhile(o)){if(r.strikethrough){i.highlightFormatting&&(r.formatting="strikethrough");f=T(r);return r.strikethrough=!1,f}if(e.match(/^[^\s]/,!1))return r.strikethrough=!0,i.highlightFormatting&&(r.formatting="strikethrough"),T(r)}else if(" "===o&&e.match(/^~~/,!0)){if(" "===e.peek())return T(r);e.backUp(2)}if(i.emoji&&":"===o&&e.match(/^[a-z_\d+-]+:/)){r.emoji=!0,i.highlightFormatting&&(r.formatting="emoji");var H=T(r);return r.emoji=!1,H}return" "===o&&(e.match(/ +$/,!1)?r.trailingSpace++:r.trailingSpace&&(r.trailingSpaceNewLine=!0)),T(r)}function F(t,e){if(">"===t.next()){e.f=e.inline=M,i.highlightFormatting&&(e.formatting="link");var n=T(e);return n?n+=" ":n="",n+a.linkInline}return t.match(/^[^>]+/,!0),a.linkInline}function b(t,e){if(t.eatSpace())return null;var n,r=t.next();return"("===r||"["===r?(e.f=e.inline=(n="("===r?")":"]",function(t,e){var r=t.next();if(r===n){e.f=e.inline=M,i.highlightFormatting&&(e.formatting="link-string");var a=T(e);return e.linkHref=!1,a}return t.match(E[n]),e.linkHref=!0,T(e)}),i.highlightFormatting&&(e.formatting="link-string"),e.linkHref=!0,T(e)):"error"}var E={")":/^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,"]":/^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/};function w(t,e){return t.match(/^([^\]\\]|\\.)*\]:/,!1)?(e.f=j,t.next(),i.highlightFormatting&&(e.formatting="link"),e.linkText=!0,T(e)):k(t,e,M)}function j(t,e){if(t.match(/^\]:/,!0)){e.f=e.inline=y,i.highlightFormatting&&(e.formatting="link");var n=T(e);return e.linkText=!1,n}return t.match(/^([^\]\\]|\\.)+/,!0),a.linkText}function y(t,e){return t.eatSpace()?null:(t.match(/^[^\s]+/,!0),void 0===t.peek()?e.linkTitle=!0:t.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/,!0),e.f=e.inline=M,a.linkHref+" url")}var C={startState:function(){return{f:v,prevLine:{stream:null},thisLine:{stream:null},block:v,htmlState:null,indentation:0,inline:M,text:q,formatting:!1,linkText:!1,linkHref:!1,linkTitle:!1,code:0,em:!1,strong:!1,header:0,setext:0,hr:!1,taskList:!1,list:!1,listStack:[],quote:0,trailingSpace:0,trailingSpaceNewLine:!1,strikethrough:!1,emoji:!1,fencedEndRE:null}},copyState:function(e){return{f:e.f,prevLine:e.prevLine,thisLine:e.thisLine,block:e.block,htmlState:e.htmlState&&t.copyState(n,e.htmlState),indentation:e.indentation,localMode:e.localMode,localState:e.localMode?t.copyState(e.localMode,e.localState):null,inline:e.inline,text:e.text,formatting:!1,linkText:e.linkText,linkTitle:e.linkTitle,linkHref:e.linkHref,code:e.code,em:e.em,strong:e.strong,strikethrough:e.strikethrough,emoji:e.emoji,header:e.header,setext:e.setext,hr:e.hr,taskList:e.taskList,list:e.list,listStack:e.listStack.slice(0),quote:e.quote,indentedCode:e.indentedCode,trailingSpace:e.trailingSpace,trailingSpaceNewLine:e.trailingSpaceNewLine,md_inside:e.md_inside,fencedEndRE:e.fencedEndRE}},token:function(t,e){if(e.formatting=!1,t!=e.thisLine.stream){if(e.header=0,e.hr=!1,t.match(/^\s*$/,!0))return x(e),null;if(e.prevLine=e.thisLine,e.thisLine={stream:t},e.taskList=!1,e.trailingSpace=0,e.trailingSpaceNewLine=!1,!e.localState&&(e.f=e.block,e.f!=S)){var i=t.match(/^\s*/,!0)[0].replace(/\t/g,"    ").length;if(e.indentation=i,e.indentationDiff=null,i>0)return null}}return e.f(t,e)},innerMode:function(t){return t.block==S?{state:t.htmlState,mode:n}:t.localState?{state:t.localState,mode:t.localMode}:{state:t,mode:C}},indent:function(e,i,r){return e.block==S&&n.indent?n.indent(e.htmlState,i,r):e.localState&&e.localMode.indent?e.localMode.indent(e.localState,i,r):t.Pass},blankLine:x,getType:T,closeBrackets:"()[]{}''\"\"``",fold:"markdown"};return C},"xml"),t.defineMIME("text/markdown","markdown"),t.defineMIME("text/x-markdown","markdown")});
