all: test

FORCE:

test: npm lib FORCE
	mocha

npm: package.json
	npm install

lib: src
	mkdir -p lib
	babel src --out-dir lib

