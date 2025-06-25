"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAddTranscriber = exports.isRecorderTranscriptionsRunning = exports.isTranscribing = exports.determineTranscriptionLanguage = void 0;
const i18next_1 = __importDefault(require("i18next"));
const functions_1 = require("../base/jwt/functions");
const functions_2 = require("../base/participants/functions");
const jitsi_bcp47_map_json_1 = __importDefault(require("./jitsi-bcp47-map.json"));
const logger_1 = __importDefault(require("./logger"));
const transcriber_langs_json_1 = __importDefault(require("./transcriber-langs.json"));
const DEFAULT_TRANSCRIBER_LANG = 'en-US';
/**
 * Determine which language to use for transcribing.
 *
 * @param {*} config - Application config.
 * @returns {string}
 */
function determineTranscriptionLanguage(config) {
    const { transcription } = config;
    // if transcriptions are not enabled nothing to determine
    if (!transcription?.enabled) {
        return undefined;
    }
    // Depending on the config either use the language that the app automatically detected or the hardcoded
    // config BCP47 value.
    // Jitsi language detections uses custom language tags, but the transcriber expects BCP-47 compliant tags,
    // we use a mapping file to convert them.
    const bcp47Locale = (transcription?.useAppLanguage ?? true)
        ? jitsi_bcp47_map_json_1.default[i18next_1.default.language]
        : transcription?.preferredLanguage;
    // Check if the obtained language is supported by the transcriber
    let safeBCP47Locale = transcriber_langs_json_1.default[bcp47Locale] && bcp47Locale;
    if (!safeBCP47Locale) {
        safeBCP47Locale = DEFAULT_TRANSCRIBER_LANG;
        logger_1.default.warn(`Transcriber language ${bcp47Locale} is not supported, using default ${DEFAULT_TRANSCRIBER_LANG}`);
    }
    logger_1.default.info(`Transcriber language set to ${safeBCP47Locale}`);
    return safeBCP47Locale;
}
exports.determineTranscriptionLanguage = determineTranscriptionLanguage;
/**
 * Returns whether there is transcribing.
 *
 * @param {IReduxState} state - The redux state to search in.
 * @returns {boolean}
 */
function isTranscribing(state) {
    return state['features/transcribing'].isTranscribing;
}
exports.isTranscribing = isTranscribing;
/**
 * Returns true if there is a recorder transcription session running.
 * NOTE: If only the subtitles are running this function will return false.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
function isRecorderTranscriptionsRunning(state) {
    const { metadata } = state['features/base/conference'];
    return isTranscribing(state) && Boolean(metadata?.recording?.isTranscribingEnabled);
}
exports.isRecorderTranscriptionsRunning = isRecorderTranscriptionsRunning;
/**
 * Checks whether the participant can start the transcription.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the participant can start the transcription.
 */
function canAddTranscriber(state) {
    const { transcription } = state['features/base/config'];
    const isJwtTranscribingEnabled = (0, functions_1.isJwtFeatureEnabled)(state, 'transcription', (0, functions_2.isLocalParticipantModerator)(state));
    if (!transcription?.enabled) {
        return false;
    }
    if (isJwtTranscribingEnabled) {
        return true;
    }
    return false;
}
exports.canAddTranscriber = canAddTranscriber;
