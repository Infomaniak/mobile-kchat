"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const STORE_NAME = 'features/virtual-background';
/**
 * Reduces redux actions which activate/deactivate virtual background image, or
 * indicate if the virtual image background is activated/deactivated. The
 * backgroundEffectEnabled flag indicate if virtual background effect is activated.
 *
 * @param {State} state - The current redux state.
 * @param {Action} action - The redux action to reduce.
 * @param {string} action.type - The type of the redux action to reduce..
 * @returns {State} The next redux state that is the result of reducing the
 * specified action.
 */
ReducerRegistry_1.default.register(STORE_NAME, (state = {}, action) => {
    const { virtualSource, backgroundEffectEnabled, blurValue, backgroundType, selectedThumbnail } = action;
    /**
     * Sets up the persistence of the feature {@code virtual-background}.
     */
    PersistenceRegistry_1.default.register(STORE_NAME);
    switch (action.type) {
        case actionTypes_1.SET_VIRTUAL_BACKGROUND: {
            return {
                ...state,
                virtualSource,
                blurValue,
                backgroundType,
                selectedThumbnail
            };
        }
        case actionTypes_1.BACKGROUND_ENABLED: {
            return {
                ...state,
                backgroundEffectEnabled
            };
        }
    }
    return state;
});
