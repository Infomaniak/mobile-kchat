"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    /**
     * Whether we are in carmode.
     *
     * @public
     * @type {boolean}
     */
    carMode: false,
    remoteScreenShares: [],
    /**
     * The indicator which determines whether the video layout should display
     * video thumbnails in a tiled layout.
     *
     * Note: undefined means that the user hasn't requested anything in particular yet, so
     * we use our auto switching rules.
     *
     * @public
     * @type {boolean}
     */
    tileViewEnabled: undefined
};
const STORE_NAME = 'features/video-layout';
ReducerRegistry_1.default.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED:
            return {
                ...state,
                remoteScreenShares: action.participantIds
            };
        case actionTypes_1.SET_CAR_MODE:
            return {
                ...state,
                carMode: action.enabled
            };
        case actionTypes_1.SET_TILE_VIEW:
            return {
                ...state,
                tileViewEnabled: action.enabled
            };
    }
    return state;
});
