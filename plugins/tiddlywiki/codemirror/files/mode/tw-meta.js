!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../lib/codemirror")):"function"==typeof define&&define.amd?define(["../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";e.modeInfo=[{name:"CMake",mime:"text/x-cmake",mode:"cmake",ext:["cmake","cmake.in"],file:/^CMakeLists.txt$/},{name:"Cython",mime:"text/x-cython",mode:"python",ext:["pyx","pxd","pxi"]},{name:"CSS",mime:"text/css",mode:"css",ext:["css"]},{name:"diff",mime:"text/x-diff",mode:"diff",ext:["diff","patch"]},{name:"Embedded Javascript",mime:"application/x-ejs",mode:"htmlembedded",ext:["ejs"]},{name:"Embedded Ruby",mime:"application/x-erb",mode:"htmlembedded",ext:["erb"]},{name:"Erlang",mime:"text/x-erlang",mode:"erlang",ext:["erl"]},{name:"GitHub Flavored Markdown",mime:"text/x-gfm",mode:"gfm",file:/^(readme|contributing|history).md$/i},{name:"Go",mime:"text/x-go",mode:"go",ext:["go"]},{name:"ASP.NET",mime:"application/x-aspx",mode:"htmlembedded",ext:["aspx"],alias:["asp","aspx"]},{name:"HTML",mime:"text/html",mode:"htmlmixed",ext:["html","htm","handlebars","hbs"],alias:["xhtml"]},{name:"HTTP",mime:"message/http",mode:"http"},{name:"JavaScript",mimes:["text/javascript","text/ecmascript","application/javascript","application/x-javascript","application/ecmascript"],mode:"javascript",ext:["js"],alias:["ecmascript","js","node"]},{name:"JSON",mimes:["application/json","application/x-json"],mode:"javascript",ext:["json","map"],alias:["json5"]},{name:"JSON-LD",mime:"application/ld+json",mode:"javascript",ext:["jsonld"],alias:["jsonld"]},{name:"Lua",mime:"text/x-lua",mode:"lua",ext:["lua"]},{name:"Markdown",mimes:["text/x-markdown","text/markdown"],mode:"markdown",ext:["markdown","md","mkd"]},{name:"MySQL",mime:"text/x-mysql",mode:"sql"},{name:"Plain Text",mime:"text/plain",mode:"null",ext:["txt","text","conf","def","list","log"]},{name:"Python",mime:"text/x-python",mode:"python",ext:["BUILD","bzl","py","pyw"],file:/^(BUCK|BUILD)$/},{name:"SCSS",mime:"text/x-scss",mode:"css",ext:["scss"]},{name:"LaTeX",mime:"text/x-latex",mode:"stex",ext:["text","ltx","tex"],alias:["tex"]},{name:"TiddlyWiki ",mime:"text/x-tiddlywiki",mode:"tiddlywiki"}];for(var t=0;t<e.modeInfo.length;t++){var m=e.modeInfo[t];m.mimes&&(m.mime=m.mimes[0])}e.findModeByMIME=function(t){t=t.toLowerCase();for(var m=0;m<e.modeInfo.length;m++){var i=e.modeInfo[m];if(i.mime==t)return i;if(i.mimes)for(var a=0;a<i.mimes.length;a++)if(i.mimes[a]==t)return i}return/\+xml$/.test(t)?e.findModeByMIME("application/xml"):/\+json$/.test(t)?e.findModeByMIME("application/json"):void 0},e.findModeByExtension=function(t){for(var m=0;m<e.modeInfo.length;m++){var i=e.modeInfo[m];if(i.ext)for(var a=0;a<i.ext.length;a++)if(i.ext[a]==t)return i}},e.findModeByFileName=function(t){for(var m=0;m<e.modeInfo.length;m++){var i=e.modeInfo[m];if(i.file&&i.file.test(t))return i}var a=t.lastIndexOf("."),o=a>-1&&t.substring(a+1,t.length);if(o)return e.findModeByExtension(o)},e.findModeByName=function(t){t=t.toLowerCase();for(var m=0;m<e.modeInfo.length;m++){var i=e.modeInfo[m];if(i.name.toLowerCase()==t)return i;if(i.alias)for(var a=0;a<i.alias.length;a++)if(i.alias[a].toLowerCase()==t)return i}}});
