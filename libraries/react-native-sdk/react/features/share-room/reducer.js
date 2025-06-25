"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    shareDialogVisible: false
};
ReducerRegistry_1.default.register('features/share-room', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.TOGGLE_SHARE_DIALOG:
            return {
                ...state,
                shareDialogVisible: action.visible
            };
    }
    return state;
});
