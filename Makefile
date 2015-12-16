all: test

FORCE:

test: npm bundle FORCE
	npm test

npm: package.json
	npm install

bundle: src
	./node_modules/browserify/bin/cmd.js src/fuzzyurl.js -s Fuzzyurl -d \
		-t [ babelify --presets [ es2015 ] ] | \
		./node_modules/exorcist/bin/exorcist.js fuzzyurl.js.map > fuzzyurl.js && \
	./node_modules/uglify-js/bin/uglifyjs --source-map fuzzyurl.min.js.map \
	 	--in-source-map fuzzyurl.js.map fuzzyurl.js > fuzzyurl.min.js

