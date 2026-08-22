#!/bin/sh
cat src/objs.js src/screens.js src/main.js | minify --type js -o index.js
minify base/main.html -o index.html
minify base/main.css -o index.css
echo "Finished building!"
