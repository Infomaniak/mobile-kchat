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
const STORE_NAME = 'features/keyboard-shortcuts';
const defaultState = {
    enabled: true,
    shortcuts: new Map(),
    shortcutsHelp: new Map()
};
PersistenceRegistry_1.default.register(STORE_NAME, {
    enabled: true
});
ReducerRegistry_1.default.register(STORE_NAME, (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes_1.ENABLE_KEYBOARD_SHORTCUTS:
            return {
                ...state,
                enabled: true
            };
        case actionTypes_1.DISABLE_KEYBOARD_SHORTCUTS:
            return {
                ...state,
                enabled: false
            };
        case actionTypes_1.REGISTER_KEYBOARD_SHORTCUT: {
            const shortcutKey = action.shortcut.alt ? `:${action.shortcut.character}` : action.shortcut.character;
            return {
                ...state,
                shortcuts: new Map(state.shortcuts)
                    .set(shortcutKey, action.shortcut),
                shortcutsHelp: action.shortcut.helpDescription
                    ? new Map(state.shortcutsHelp)
                        .set(action.shortcut.helpCharacter ?? shortcutKey, action.shortcut.helpDescription)
                    : state.shortcutsHelp
            };
        }
        case actionTypes_1.UNREGISTER_KEYBOARD_SHORTCUT: {
            const shortcutKey = action.alt ? `:${action.character}` : action.character;
            const shortcuts = new Map(state.shortcuts);
            shortcuts.delete(shortcutKey);
            const shortcutsHelp = new Map(state.shortcutsHelp);
            shortcutsHelp.delete(shortcutKey);
            return {
                ...state,
                shortcuts,
                shortcutsHelp
            };
        }
    }
    return state;
});
