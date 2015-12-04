all: test

FORCE:

test: npm lib FORCE
	npm test

npm: package.json
	npm install

lib: src
	mkdir -p lib
	babel src/ --out-dir lib

