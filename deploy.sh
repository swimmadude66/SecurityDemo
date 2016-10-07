#!/bin/bash

npm install && bower install && typings install
tsc
cp -R client/ dist/
