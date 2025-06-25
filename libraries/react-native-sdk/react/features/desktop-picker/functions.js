"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._separateSourcesByType = exports.oldJitsiMeetElectronUsage = exports.obtainDesktopSources = void 0;
const logger_1 = __importDefault(require("./logger"));
/**
 * Begins a request to get available DesktopCapturerSources.
 *
 * @param {Object} options - Additional configuration for getting a list of
 * sources.
 * @param {Array} options.types - An array with DesktopCapturerSource type strings.
 * @param {Object} options.thumbnailSize - The desired height and width of the
 * return native image object used for the preview image of the source.
 * @returns {Function}
 */
function obtainDesktopSources(options) {
    const { JitsiMeetElectron } = window;
    // TODO: delete this after 2 releases
    if (JitsiMeetElectron?.obtainDesktopStreams) {
        return new Promise((resolve, reject) => {
            JitsiMeetElectron.obtainDesktopStreams((sources) => resolve(_separateSourcesByType(sources)), (error) => {
                logger_1.default.error(`Error while obtaining desktop sources: ${error}`);
                reject(error);
            }, options);
        });
    }
    return APP.API.requestDesktopSources(options).then(({ sources, error }) => {
        if (sources) {
            return _separateSourcesByType(sources);
        }
        else if (error) {
            logger_1.default.error(`Error while obtaining desktop sources: ${error}`);
            return null;
        }
    });
}
exports.obtainDesktopSources = obtainDesktopSources;
/**
 * Check usage of old jitsi meet electron version.
 *
 * @returns {boolean} True if we use old jitsi meet electron, otherwise false.
 */
function oldJitsiMeetElectronUsage() {
    const { JitsiMeetElectron } = window;
    if (JitsiMeetElectron?.obtainDesktopStreams) {
        return true;
    }
    return false;
}
exports.oldJitsiMeetElectronUsage = oldJitsiMeetElectronUsage;
/**
 * Converts an array of DesktopCapturerSources to an object with types for keys
 * and values being an array with sources of the key's type.
 *
 * @param {Array} sources - DesktopCapturerSources.
 * @private
 * @returns {Object} An object with the sources split into separate arrays based
 * on source type.
 */
function _separateSourcesByType(sources = []) {
    const sourcesByType = {
        screen: [],
        window: []
    };
    sources.forEach(source => {
        const idParts = source.id.split(':');
        const type = idParts[0];
        if (sourcesByType[type]) {
            sourcesByType[type].push(source);
        }
    });
    return sourcesByType;
}
exports._separateSourcesByType = _separateSourcesByType;
