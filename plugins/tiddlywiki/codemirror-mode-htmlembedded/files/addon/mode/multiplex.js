// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(p){"use strict";p.multiplexingMode=function(d){var f=Array.prototype.slice.call(arguments,1);function m(e,n,t,i){if("string"==typeof n){var r=e.indexOf(n,t);return i&&-1<r?r+n.length:r}var o=n.exec(t?e.slice(t):e);return o?o.index+t+(i?o[0].length:0):-1}return{startState:function(){return{outer:p.startState(d),innerActive:null,inner:null}},copyState:function(e){return{outer:p.copyState(d,e.outer),innerActive:e.innerActive,inner:e.innerActive&&p.copyState(e.innerActive.mode,e.inner)}},token:function(e,n){if(n.innerActive){var t=n.innerActive,i=e.string;if(!t.close&&e.sol())return n.innerActive=n.inner=null,this.token(e,n);if((l=t.close?m(i,t.close,e.pos,t.parseDelimiters):-1)==e.pos&&!t.parseDelimiters)return e.match(t.close),n.innerActive=n.inner=null,t.delimStyle&&t.delimStyle+" "+t.delimStyle+"-close";-1<l&&(e.string=i.slice(0,l));var r=t.mode.token(e,n.inner);return-1<l&&(e.string=i),l==e.pos&&t.parseDelimiters&&(n.innerActive=n.inner=null),t.innerStyle&&(r=r?r+" "+t.innerStyle:t.innerStyle),r}for(var o=1/0,i=e.string,c=0;c<f.length;++c){var l,s=f[c];if((l=m(i,s.open,e.pos))==e.pos){s.parseDelimiters||e.match(s.open),n.innerActive=s;var a,u=0;return!d.indent||(a=d.indent(n.outer,"",""))!==p.Pass&&(u=a),n.inner=p.startState(s.mode,u),s.delimStyle&&s.delimStyle+" "+s.delimStyle+"-open"}-1!=l&&l<o&&(o=l)}o!=1/0&&(e.string=i.slice(0,o));var v=d.token(e,n.outer);return o!=1/0&&(e.string=i),v},indent:function(e,n,t){var i=e.innerActive?e.innerActive.mode:d;return i.indent?i.indent(e.innerActive?e.inner:e.outer,n,t):p.Pass},blankLine:function(e){var n=e.innerActive?e.innerActive.mode:d;if(n.blankLine&&n.blankLine(e.innerActive?e.inner:e.outer),e.innerActive)"\n"===e.innerActive.close&&(e.innerActive=e.inner=null);else for(var t=0;t<f.length;++t){var i=f[t];"\n"===i.open&&(e.innerActive=i,e.inner=p.startState(i.mode,n.indent?n.indent(e.outer,"",""):0))}},electricChars:d.electricChars,innerMode:function(e){return e.inner?{state:e.inner,mode:e.innerActive.mode}:{state:e.outer,mode:d}}}}});
