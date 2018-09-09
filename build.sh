#!/bin/bash

# This script compiles typescript and Angular 5 application and puts them into a single NodeJS prject
echo "-- Started build script for Angular & NodeJS --"
echo "Removing out directory..."
rm -rf out

echo "Creating out directory..."
mkdir out
# mkdir out/src

# echo "Copying configuration files..."
# cp -Rf src/config out/src/config

echo "Installing Angular app dependencies..."
cd angular-src && npm install --only=dev

echo "Building Angular app for distribution..."
./node_modules/.bin/ng build --aot --prod

echo "Building Angular app for server side rendering..."
./node_modules/.bin/ng run angular-src:server

# echo "Copying angular dist into out directory..."
# mkdir ../out/src/dist
# cp -Rf dist ../out/src

# echo "Removing angular-src dist directory..."
# rm -rf dist

# Go back to the current directory
cd ..

echo "Running webpack..."
webpack --config webpack.server.config.js --progress --colors

echo "-- Finished building Angular & NodeJS, check out directory --"
