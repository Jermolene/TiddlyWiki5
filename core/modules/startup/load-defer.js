/*\
title: $:/core/modules/startup/load-defer.js
type: application/javascript
module-type: startup

Register tiddlerloader plugins and load deferred tiddlers.
\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    
    // Export name and synchronous status
    exports.name = "load-defer";
    exports.platforms = ["node"];
    exports.after = ["plugins"];
    exports.synchronous = true;

    var parsers = {};
    
    $tw.deserializerParsers = parsers;
    
    exports.startup = function(callback) {
        console.log("Loading deferred module core...");
        // First, exec all tiddlerloaders
        // var modules = $tw.modules.getModulesByTypeAsHashmap("tiddlerLoader")
        // console.log("DEBUG: ", modules)
        $tw.modules.forEachModuleOfType("tiddlerLoader",function(title,module) {
            for(var f in module) {
                if($tw.utils.hop(module,f)) {
                    parsers[f] = module[f]; // Store the parser class
                }
            }
        });
        console.log("deserializerParsers: ", parsers)

        var specs = $tw.deferredDirSpecs;
        // console.log("Specs to load: ", specs)
        /**
         * Now, what I _really_ want to do
         * Is, from my dir spec, load the files in memory as blobs
         * call the relevant tiddlerloader plugin to deserialize the bins
         * then pass on the tiddlers for parsing and such ?
         * 
         * For each deferredDirSpecs
         * Cross-reference the deferedFiletype with our parsers
         * For each file in there, get a blob using fs.readFileSync
         * use our parser to interpret the blob
         * add tiddler?
         */

        $tw.utils.each(specs, function(spec){

            var path = spec.filepath;
            var filespec = spec.dirSpec;

            var tiddlers = $tw.loadTiddlersFromSpecification(path, undefined, true)
            $tw.utils.each(tiddlers,function(tiddlerFile) {
                console.log("After defer, adding tiddler: ", tiddlerFile.tiddlers)
                $tw.wiki.addTiddlers(tiddlerFile.tiddlers);
            });
        });

        // console.log("wikiop: ", $tw.wiki.readPluginInfo())
    };
    
    })();
    