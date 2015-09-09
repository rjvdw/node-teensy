#!/bin/sh

set -e

node node_modules/.bin/istanbul cover _mocha -- -R spec test/*
