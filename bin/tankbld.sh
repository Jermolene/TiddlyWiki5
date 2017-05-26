#!/bin/bash

# build the Tank edition of TiddlyWiki

# See https://tank.peermore.com

# Open the tank edition in TW5 and save the template for the main HTML file

node ./tiddlywiki.js \
	 ./editions/tw5tank \
	--verbose \
	--output output \
	--rendertiddler $:/core/save/all app.html text/plain \
	|| exit 1

# Prepend the type information that TiddlyWeb needs to turn the .html file into a .tid file

echo "type: text/html" > output/app.txt
echo "" >> output/app.txt
cat output/app.html >> output/app.txt
