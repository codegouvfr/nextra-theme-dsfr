#!/bin/bash

HERE=$(pwd)

cd .. 
git clone https://github.com/garronej/nextra-dsfr-demo > /dev/null 2>&1 || true
cd nextra-dsfr-demo
rm -rf node_modules .next
yarn

cd $HERE
rm -rf node_modules .yarn_home dist
yarn
yarn build
yarn link-in-app nextra-dsfr-demo

echo ""
echo "✅ You can now open a code editor in nextra-dsfr-demo and start the Next demo app in dev mode"
echo "cd $PWD/nextra-dsfr-demo"
echo "code ."
echo "yarn dev"

echo ""
echo "... starting incremental compilation in 10 seconds"

sleep 5
npx tsc -w

