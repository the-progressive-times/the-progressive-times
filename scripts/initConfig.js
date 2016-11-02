#!/usr/bin/env node

'use strict';

let crypto = require('crypto');
let fs = require('fs');

function main() {
    let configJs = __dirname + '/../server/config/config.js';

    if (!fileExists(configJs)) {
        let config = 'module.exports = {' + "\n" +
          '    ' + 'secretKey: ' + getRandomSalt() + "\n" +
          '}';

        fs.writeFileSync(configJs, config);
    } else {
        console.log("Hello world!");
    }
}

function fileExists(path) {
    try {
        return fs.statSync(path).isFile();
    } catch (err) {
        return false;
    }
}

function getRandomSalt() {
    return crypto.randomBytes(64).toString('base64');
}

main();
