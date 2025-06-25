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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAccents = exports.normalizeNFKC = void 0;
const unorm = __importStar(require("unorm"));
/**
 * Applies NFKC normalization to the given text.
 * NOTE: Here we use the unorm package because the JSC version in React Native for Android crashes.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
function normalizeNFKC(text) {
    return unorm.nfkc(text);
}
exports.normalizeNFKC = normalizeNFKC;
/**
 * Replaces accent characters with english alphabet characters.
 * NOTE: Here we use the unorm package because the JSC version in React Native for Android crashes.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
function normalizeAccents(text) {
    return unorm.nfd(text).replace(/[\u0300-\u036f]/g, '');
}
exports.normalizeAccents = normalizeAccents;
