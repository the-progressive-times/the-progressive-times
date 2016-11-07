#!/usr/bin/env node

'use strict';

let crypto = require('crypto');
let fs = require('fs');

function main() {
    let configJs = __dirname + '/../server/config/config.js';

    if (!fileExists(configJs)) {
        let secretKeyRoot = {
            'secretKey': getRandomSalt()
        };

        let config = 'module.exports = ' + JSON.stringify(secretKeyRoot, null, 2) + ';';

        fs.writeFileSync(configJs, config);
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
