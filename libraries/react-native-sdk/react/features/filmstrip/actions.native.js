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
exports.removeStageParticipant = exports.addStageParticipant = exports.setTileViewDimensions = void 0;
const styles_1 = __importDefault(require("../conference/components/native/styles"));
const actionTypes_1 = require("./actionTypes");
const styles_2 = __importDefault(require("./components/native/styles"));
const constants_1 = require("./constants");
const functions_native_1 = require("./functions.native");
__exportStar(require("./actions.any"), exports);
/**
 * Sets the dimensions of the tile view grid. The action is only partially implemented on native as not all
 * of the values are currently used. Check the description of {@link SET_TILE_VIEW_DIMENSIONS} for the full set
 * of properties.
 *
 * @returns {Function}
 */
function setTileViewDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const participantCount = (0, functions_native_1.getTileViewParticipantCount)(state);
        const { clientHeight: height, clientWidth: width, safeAreaInsets = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        } } = state['features/base/responsive-ui'];
        const { left = 0, right = 0, top = 0, bottom = 0 } = safeAreaInsets;
        const columns = (0, functions_native_1.getColumnCount)(state);
        const rows = Math.ceil(participantCount / columns); // @ts-ignore
        const conferenceBorder = styles_1.default.conference.borderWidth || 0;
        const heightToUse = height - top - bottom - (2 * conferenceBorder);
        const widthToUse = width - (constants_1.TILE_MARGIN * 2) - left - right - (2 * conferenceBorder);
        let tileWidth;
        // If there is going to be at least two rows, ensure that at least two
        // rows display fully on screen.
        if (participantCount / columns > 1) {
            tileWidth = Math.min(widthToUse / columns, heightToUse / 2);
        }
        else {
            tileWidth = Math.min(widthToUse / columns, heightToUse);
        }
        const tileHeight = Math.floor(tileWidth / constants_1.SQUARE_TILE_ASPECT_RATIO);
        tileWidth = Math.floor(tileWidth);
        // Adding safeAreaInsets.bottom to the total height of all thumbnails because we add it as a padding to the
        // thumbnails container.
        const hasScroll = heightToUse < ((tileHeight + (2 * styles_2.default.thumbnail.margin)) * rows) + bottom;
        dispatch({
            type: actionTypes_1.SET_TILE_VIEW_DIMENSIONS,
            dimensions: {
                columns,
                thumbnailSize: {
                    height: tileHeight,
                    width: tileWidth
                },
                hasScroll
            }
        });
    };
}
exports.setTileViewDimensions = setTileViewDimensions;
/**
 * Add participant to the active participants list.
 *
 * @param {string} _participantId - The Id of the participant to be added.
 * @param {boolean?} _pinned - Whether the participant is pinned or not.
 * @returns {Object}
 */
function addStageParticipant(_participantId, _pinned = false) {
    return {};
}
exports.addStageParticipant = addStageParticipant;
/**
 * Remove participant from the active participants list.
 *
 * @param {string} _participantId - The Id of the participant to be removed.
 * @returns {Object}
 */
function removeStageParticipant(_participantId) {
    return {};
}
exports.removeStageParticipant = removeStageParticipant;
