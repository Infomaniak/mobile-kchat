"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceRegistry_1 = __importDefault(require("../base/redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * The redux subtree of this feature.
 */
const STORE_NAME = 'features/dropbox';
/**
 * Sets up the persistence of the feature {@code dropbox}.
 */
PersistenceRegistry_1.default.register(STORE_NAME);
ReducerRegistry_1.default.register(STORE_NAME, (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.UPDATE_DROPBOX_TOKEN:
            return {
                ...state,
                token: action.token,
                rToken: action.rToken,
                expireDate: action.expireDate
            };
        default:
            return state;
    }
});
