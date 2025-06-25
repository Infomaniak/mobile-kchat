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
exports.shouldEnableAutoKnock = exports.lobbyScreenHeaderCloseButton = exports.isPrejoinPageEnabled = exports.screenHeaderCloseButton = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../../app/actions.native");
const constants_1 = require("../../base/flags/constants");
const functions_1 = require("../../base/flags/functions");
const svg_1 = require("../../base/icons/svg");
const functions_2 = require("../../base/redux/functions");
const actions_native_2 = require("../../lobby/actions.native");
const functions_3 = require("../../prejoin/functions");
const HeaderNavigationButton_1 = __importDefault(require("./components/HeaderNavigationButton"));
/**
 * Close icon/text button based on platform.
 *
 * @param {Function} goBack - Goes back to the previous screen function.
 * @returns {React.Component}
 */
function screenHeaderCloseButton(goBack) {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (react_native_1.Platform.OS === 'ios') {
        return (<HeaderNavigationButton_1.default label={t('dialog.close')} onPress={goBack}/>);
    }
    return (<HeaderNavigationButton_1.default onPress={goBack} src={svg_1.IconCloseLarge}/>);
}
exports.screenHeaderCloseButton = screenHeaderCloseButton;
/**
 * Determines whether the {@code Prejoin page} is enabled by the app itself
 * (e.g. Programmatically via the Jitsi Meet SDK for Android and iOS).
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code Prejoin} is enabled by the app, then
 * {@code true}; otherwise, {@code false}.
 */
function isPrejoinPageEnabled(stateful) {
    const state = (0, functions_2.toState)(stateful);
    return (0, functions_1.getFeatureFlag)(state, constants_1.PREJOIN_PAGE_ENABLED, (0, functions_3.isPrejoinEnabledInConfig)(state));
}
exports.isPrejoinPageEnabled = isPrejoinPageEnabled;
/**
 * Close icon/text button for lobby screen based on platform.
 *
 * @returns {React.Component}
 */
function lobbyScreenHeaderCloseButton() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const goBack = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_2.cancelKnocking)());
        dispatch((0, actions_native_1.appNavigate)(undefined));
    }, [dispatch]);
    if (react_native_1.Platform.OS === 'ios') {
        return (<HeaderNavigationButton_1.default label={t('dialog.close')} onPress={goBack}/>);
    }
    return (<HeaderNavigationButton_1.default onPress={goBack} src={svg_1.IconCloseLarge}/>);
}
exports.lobbyScreenHeaderCloseButton = lobbyScreenHeaderCloseButton;
/**
 * Returns true if we should auto-knock in case prejoin is enabled for the room.
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean}
 */
function shouldEnableAutoKnock(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { displayName } = state['features/base/settings'];
    if (isPrejoinPageEnabled(state)) {
        if (displayName) {
            return true;
        }
    }
    else {
        return false;
    }
}
exports.shouldEnableAutoKnock = shouldEnableAutoKnock;
