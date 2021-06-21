#!/usr/bin/env node
const utils = require('@openworkshop/maker-builder/utils');

async function main() {
  await utils.execute('dotnet Makerverse.dll');
}

void main().catch(e => {
  console.log(e);
});
