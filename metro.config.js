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

// @jitsi/react-native-sdk bundles its own nested copies of
// @react-navigation/native (6.1.18) and @react-navigation/core (6.4.17), but its
// @react-navigation/stack gets hoisted to the top of node_modules and resolves
// the v7 copies installed for expo-router. React contexts of two different
// module instances are incompatible: the SDK's RootStack.Navigator would then
// never register with the SDK's v6 NavigationContainer, isReady() would stay
// false forever and every navigation action would be dropped (calls stuck on
// the connecting screen). Redirect the stack package family's imports to the
// SDK's nested copies so the whole SDK tree shares one module instance.
const jitsiNavRoot = path.resolve(__dirname, 'node_modules/@jitsi/react-native-sdk/node_modules');
const jitsiStackOriginPattern = new RegExp(`${path.sep}node_modules${path.sep}@react-navigation${path.sep}stack${path.sep}`);

// use-latest-callback@0.1.x (nested under react-native-tab-view@3.x via the Jitsi SDK) ships an
// esm.mjs entry that breaks under Metro's interop (double `default` unwrap -> undefined).
// Force every importer onto the single working top-level copy (0.2.x).
const useLatestCallbackRoot = path.resolve(__dirname, 'node_modules/use-latest-callback');

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

            if (moduleName === 'use-latest-callback') {
                return context.resolveRequest(context, useLatestCallbackRoot, platform);
            }

            if (
                context.originModulePath?.match(jitsiStackOriginPattern) &&
                (moduleName === '@react-navigation/core' || moduleName === '@react-navigation/native')
            ) {
                return context.resolveRequest(context, path.join(jitsiNavRoot, moduleName), platform);
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
