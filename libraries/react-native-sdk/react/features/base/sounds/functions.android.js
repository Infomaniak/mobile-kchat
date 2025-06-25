"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoundsPath = void 0;
/**
 * Returns the location of the sounds. On Android sounds files are copied to
 * the 'assets/sounds/' folder of the SDK bundle on build time.
 *
 * @returns {string}
 */
function getSoundsPath() {
    return 'asset:/sounds';
}
exports.getSoundsPath = getSoundsPath;
