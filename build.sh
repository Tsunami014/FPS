#!/bin/sh
cat main.js | minify --type js > main.js
minify main.html -o index.html
echo "Finished building!"
