#!/bin/sh

set -e

node_or_iojs=`node -h | grep -il iojs > /dev/null && echo iojs || echo node`

if [ "$node_or_iojs" = "node" ]; then
    ./node_modules/.bin/mocha --harmony-generators --reporter spec
else
    ./node_modules/.bin/mocha --reporter spec
fi
