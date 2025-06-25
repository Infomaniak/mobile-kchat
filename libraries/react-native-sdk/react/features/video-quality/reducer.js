"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/config/actionTypes");
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_2 = require("./actionTypes");
const constants_1 = require("./constants");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const DEFAULT_STATE = {
    maxReceiverVideoQualityForLargeVideo: constants_1.VIDEO_QUALITY_LEVELS.ULTRA,
    maxReceiverVideoQualityForScreenSharingFilmstrip: constants_1.VIDEO_QUALITY_LEVELS.HIGH,
    maxReceiverVideoQualityForStageFilmstrip: constants_1.VIDEO_QUALITY_LEVELS.HIGH,
    maxReceiverVideoQualityForTileView: constants_1.VIDEO_QUALITY_LEVELS.STANDARD,
    maxReceiverVideoQualityForVerticalFilmstrip: constants_1.VIDEO_QUALITY_LEVELS.LOW,
    minHeightForQualityLvl: new Map(),
    preferredVideoQuality: constants_1.VIDEO_QUALITY_LEVELS.ULTRA
};
Object.values(constants_1.VIDEO_QUALITY_LEVELS).sort()
    .forEach(value => {
    if (value > constants_1.VIDEO_QUALITY_LEVELS.NONE) {
        DEFAULT_STATE.minHeightForQualityLvl.set(value, value);
    }
});
// When the persisted state is initialized the current state (for example the default state) is erased.
// In order to workaround this issue we need additional state for the persisted properties.
PersistenceRegistry_1.default.register('features/video-quality-persistent-storage');
ReducerRegistry_1.default.register('features/video-quality-persistent-storage', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_2.SET_PREFERRED_VIDEO_QUALITY: {
            const { preferredVideoQuality } = action;
            return {
                ...state,
                persistedPrefferedVideoQuality: preferredVideoQuality
            };
        }
    }
    return state;
});
ReducerRegistry_1.default.register('features/video-quality', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_CONFIG:
            return _setConfig(state, action);
        case actionTypes_2.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_LARGE_VIDEO:
            return (0, functions_1.set)(state, 'maxReceiverVideoQualityForLargeVideo', action.maxReceiverVideoQuality);
        case actionTypes_2.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_SCREEN_SHARING_FILMSTRIP:
            return (0, functions_1.set)(state, 'maxReceiverVideoQualityForScreenSharingFilmstrip', action.maxReceiverVideoQuality);
        case actionTypes_2.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_STAGE_FILMSTRIP:
            return (0, functions_1.set)(state, 'maxReceiverVideoQualityForStageFilmstrip', action.maxReceiverVideoQuality);
        case actionTypes_2.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_TILE_VIEW:
            return (0, functions_1.set)(state, 'maxReceiverVideoQualityForTileView', action.maxReceiverVideoQuality);
        case actionTypes_2.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_VERTICAL_FILMSTRIP:
            return (0, functions_1.set)(state, 'maxReceiverVideoQualityForVerticalFilmstrip', action.maxReceiverVideoQuality);
        case actionTypes_2.SET_PREFERRED_VIDEO_QUALITY: {
            const { preferredVideoQuality } = action;
            return {
                ...state,
                preferredVideoQuality
            };
        }
    }
    return state;
});
/**
 * Extracts the height to quality level mapping from the new config.
 *
 * @param {Object} state - The Redux state of feature base/lastn.
 * @param {Action} action - The Redux action SET_CONFIG to reduce.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _setConfig(state, { config }) {
    const configuredMap = config?.videoQuality?.minHeightForQualityLvl;
    const convertedMap = (0, functions_2.validateMinHeightForQualityLvl)(configuredMap);
    if (configuredMap && !convertedMap) {
        logger_1.default.error('Invalid config value videoQuality.minHeightForQualityLvl');
    }
    return convertedMap ? (0, functions_1.set)(state, 'minHeightForQualityLvl', convertedMap) : state;
}
