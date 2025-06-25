"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const utils_1 = require("../../../base/environment/utils");
const functions_web_1 = require("../../functions.web");
const RaiseHandButton_1 = __importDefault(require("./RaiseHandButton"));
const ReactionsMenuButton_1 = __importDefault(require("./ReactionsMenuButton"));
const RaiseHandContainerButton = (props) => {
    const reactionsButtonEnabled = (0, react_redux_1.useSelector)(functions_web_1.isReactionsButtonEnabled);
    const _shouldDisplayReactionsButtons = (0, react_redux_1.useSelector)(functions_web_1.shouldDisplayReactionsButtons);
    const isNarrowLayout = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui'].isNarrowLayout);
    const showReactionsAsPartOfRaiseHand = _shouldDisplayReactionsButtons && !reactionsButtonEnabled && !isNarrowLayout && !(0, utils_1.isMobileBrowser)();
    return showReactionsAsPartOfRaiseHand
        ? react_1.default.createElement(ReactionsMenuButton_1.default, { ...props, showRaiseHand: true })
        : react_1.default.createElement(RaiseHandButton_1.default, { ...props });
};
exports.default = RaiseHandContainerButton;
