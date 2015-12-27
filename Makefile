BROWSERIFY=./node_modules/browserify/bin/cmd.js
EXORCIST=./node_modules/exorcist/bin/exorcist.js
UGLIFY=./node_modules/uglify-js/bin/uglifyjs
JSDOC=./node_modules/jsdoc/jsdoc.js

all: test

FORCE:

test: npm bundle doc FORCE
	npm test

npm: package.json
	npm install

doc: src/
	$(JSDOC) src/fuzzyurl.js -t node_modules/minami

bundle: src/ max min

max:
	$(BROWSERIFY) src/fuzzyurl.js -s Fuzzyurl -d \
  	-t [ babelify --presets [ es2015 ] ] \
	| $(EXORCIST) fuzzyurl.js.map > fuzzyurl.js

min:
	$(UGLIFY) --source-map fuzzyurl.min.js.map \
   	--in-source-map fuzzyurl.js.map fuzzyurl.js > fuzzyurl.min.js

