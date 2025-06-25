"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const { innerHeight = 0, innerWidth = 0 } = window;
/**
 * The default/initial redux state of the feature base/responsive-ui.
 */
const DEFAULT_STATE = {
    aspectRatio: constants_1.ASPECT_RATIO_NARROW,
    clientHeight: innerHeight,
    clientWidth: innerWidth,
    isNarrowLayout: false,
    reducedUI: false,
    contextMenuOpened: false
};
ReducerRegistry_1.default.register('features/base/responsive-ui', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CLIENT_RESIZED: {
            return {
                ...state,
                clientWidth: action.clientWidth,
                clientHeight: action.clientHeight
            };
        }
        case actionTypes_1.SAFE_AREA_INSETS_CHANGED:
            return {
                ...state,
                safeAreaInsets: action.insets
            };
        case actionTypes_1.SET_ASPECT_RATIO:
            return (0, functions_1.set)(state, 'aspectRatio', action.aspectRatio);
        case actionTypes_1.SET_REDUCED_UI:
            return (0, functions_1.set)(state, 'reducedUI', action.reducedUI);
        case actionTypes_1.SET_CONTEXT_MENU_OPEN:
            return (0, functions_1.set)(state, 'contextMenuOpened', action.isOpen);
        case actionTypes_1.SET_NARROW_LAYOUT:
            return (0, functions_1.set)(state, 'isNarrowLayout', action.isNarrow);
    }
    return state;
});
