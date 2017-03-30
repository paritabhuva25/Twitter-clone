# node modules in executable path
PATH := node_modules/.bin:$(PATH)

# OSX requires this variable exported so that PATH is also exported.
SHELL := /bin/bash

JS_SRC = $(shell find . -type f -name '*.js' ! -path './node_modules/*')
JSON_SRC = $(shell find . -type f -name '*.json' ! -path './node_modules/*')

.PHONY: lint test

lint:
	jsonlint -q -c ${JSON_SRC}
	eslint ${JS_SRC} ${ESLINT_ARGS}

install:
	npm i

test:install
	PGDB_DB=twitterTesting mocha

run:
	node app
