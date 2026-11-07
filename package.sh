#!/bin/sh
# Builds the zip to upload to the Chrome Web Store.
set -e
cd "$(dirname "$0")"

version=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json)
output="dist/tab-refresh-$version.zip"

mkdir -p dist
rm -f "$output"
zip -r "$output" manifest.json background.js popup.html popup.css popup.js icons -x "icons/*.svg" ".*"

echo "Created $output"
