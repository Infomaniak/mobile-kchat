"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
// @ts-ignore
const json_1 = require("@jitsi/js-utils/json");
const react_native_1 = require("react-native");
const loadScript_native_1 = require("../util/loadScript.native");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./functions.any"), exports);
const { JavaScriptSandbox } = react_native_1.NativeModules;
/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<Object>}
 */
async function loadConfig(url) {
    try {
        const configTxt = await (0, loadScript_native_1.loadScript)(url, 10 * 1000 /* Timeout in ms */, true /* skipeval */);
        const configJson = await JavaScriptSandbox.evaluate(`${configTxt}\nJSON.stringify(config);`);
        const config = (0, json_1.safeJsonParse)(configJson);
        if (typeof config !== 'object') {
            throw new Error('config is not an object');
        }
        logger_1.default.info(`Config loaded from ${url}`);
        return config;
    }
    catch (err) {
        logger_1.default.error(`Failed to load config from ${url}`, err);
        throw err;
    }
}
exports.loadConfig = loadConfig;
