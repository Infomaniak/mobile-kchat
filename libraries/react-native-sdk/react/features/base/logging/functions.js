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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._initLogging = exports.getLogger = void 0;
// @ts-expect-error
const logger_1 = __importStar(require("@jitsi/logger"));
const lodash_1 = __importDefault(require("lodash"));
const LogTransport_1 = __importDefault(require("./LogTransport"));
/**
 * Options for building the logger. We disable the callee info on RN because it's
 * almost always empty anyway.
 */
const DEFAULT_OPTS = {};
const DEFAULT_RN_OPTS = { disableCallerInfo: true };
/**
 * Gets a logger for the given id.
 *
 * @param {string} id - Name for the logger.
 * @returns {Object} - The logger object.
 */
function getLogger(id) {
    const opts = navigator.product === 'ReactNative' ? DEFAULT_RN_OPTS : DEFAULT_OPTS;
    return (0, logger_1.getLogger)(id, undefined, opts);
}
exports.getLogger = getLogger;
/**
 * Initializes native logging. This operations must be done as early as possible.
 */
exports._initLogging = lodash_1.default.once(() => {
    if (navigator.product !== 'ReactNative') {
        return;
    }
    // Lazy load it to avoid cycles in early web bootstrap code.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: JitsiMeetJS } = require('../lib-jitsi-meet/_');
    logger_1.default.setGlobalOptions(DEFAULT_RN_OPTS);
    JitsiMeetJS.setGlobalLogOptions(DEFAULT_RN_OPTS);
    logger_1.default.removeGlobalTransport(console);
    JitsiMeetJS.removeGlobalLogTransport(console);
    logger_1.default.addGlobalTransport(LogTransport_1.default);
    JitsiMeetJS.addGlobalLogTransport(LogTransport_1.default);
});
