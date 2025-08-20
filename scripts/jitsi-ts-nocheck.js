// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('node_modules/@jitsi/react-native-sdk/');

function addTsNoCheck(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    if (content.startsWith('// @ts-nocheck')) {
        return;
    }

    const newContent = '// @ts-nocheck\n' + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
}

function processDir(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDir(fullPath);
        } else {
            const ext = path.extname(item);
            if (ext === '.ts' || ext === '.tsx') {
                addTsNoCheck(fullPath);
            }
        }
    });
}

processDir(targetDir);
