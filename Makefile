BROWSERIFY=./node_modules/browserify/bin/cmd.js
EXORCIST=./node_modules/exorcist/bin/exorcist.js
UGLIFY=./node_modules/uglify-js/bin/uglifyjs

all: test

FORCE:

test: npm bundle FORCE
	npm test

npm: package.json
	npm install

bundle: src
	$(BROWSERIFY) src/fuzzyurl.js -s Fuzzyurl -d -t [ babelify --presets [ es2015 ] ] | \
		$(EXORCIST) fuzzyurl.js.map > fuzzyurl.js && \
	$(UGLIFY) --source-map fuzzyurl.min.js.map \
	 	--in-source-map fuzzyurl.js.map fuzzyurl.js > fuzzyurl.min.js

