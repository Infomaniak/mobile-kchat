// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const path = require('path');

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const refractorRoot = path.resolve(__dirname, 'node_modules/refractor');
const refractorExact = {
    'refractor': path.join(refractorRoot, 'lib/common.js'),
    'refractor/all': path.join(refractorRoot, 'lib/all.js'),
    'refractor/core': path.join(refractorRoot, 'lib/core.js'),
};

const formatjsLocalePattern = /^@formatjs\/(intl-(?:pluralrules|numberformat|datetimeformat|listformat|relativetimeformat|displaynames))\/locale-data\/([^/]+)$/;

const config = {
    resolver: {
        assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
        blockList: [
            /.*\.test\.(js|jsx|ts|tsx)$/,
            /.*\.spec\.(js|jsx|ts|tsx)$/,
            /__tests__\/.*/,
            /__mocks__\/.*/,
        ],
        resolveRequest: (context, moduleName, platform) => {
            if (Object.prototype.hasOwnProperty.call(refractorExact, moduleName)) {
                return {type: 'sourceFile', filePath: refractorExact[moduleName]};
            }

            if (moduleName.startsWith('refractor/') && !moduleName.includes('/lang/')) {
                const lang = moduleName.slice('refractor/'.length);
                const filePath = path.join(refractorRoot, 'lang', `${lang}.js`);
                if (require('fs').existsSync(filePath)) {
                    return {type: 'sourceFile', filePath};
                }
            }

            const formatjsMatch = moduleName.match(formatjsLocalePattern);
            if (formatjsMatch) {
                const [, pkg, locale] = formatjsMatch;
                const filePath = path.join(__dirname, 'node_modules/@formatjs', pkg, 'locale-data', `${locale}.js`);
                if (require('fs').existsSync(filePath)) {
                    return {type: 'sourceFile', filePath};
                }
            }

            return context.resolveRequest(context, moduleName, platform);
        },
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        unstable_allowRequireContext: true,
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = mergeConfig(defaultConfig, config);
