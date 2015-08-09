#!/bin/sh

set -e

node_or_iojs=`node -h | grep -il iojs > /dev/null && echo iojs || echo node`

if [ "$node_or_iojs" = "node" ]; then
    node --harmony_generators node_modules/.bin/istanbul cover _mocha -- -R spec test/*
else
    node node_modules/.bin/istanbul cover _mocha -- -R spec test/*
fi
