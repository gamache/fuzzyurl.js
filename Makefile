all: test

FORCE:

test: lib FORCE
	mocha

lib: src
	mkdir -p lib
	babel src --out-dir lib

