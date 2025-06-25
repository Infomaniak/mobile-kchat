"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_any_1 = require("../../functions.any");
const ReactionEmoji_1 = __importDefault(require("./ReactionEmoji"));
/**
 * Renders the reactions animations in the case when there is no buttons displayed.
 *
 * @returns {ReactNode}
 */
function ReactionAnimations() {
    const reactionsQueue = (0, react_redux_1.useSelector)(functions_any_1.getReactionsQueue);
    const _shouldDisplayReactionsButtons = (0, react_redux_1.useSelector)(functions_any_1.shouldDisplayReactionsButtons);
    const reactionsEnabled = (0, react_redux_1.useSelector)(functions_any_1.isReactionsEnabled);
    if (reactionsEnabled && !_shouldDisplayReactionsButtons) {
        return (react_1.default.createElement("div", { className: 'reactions-animations-container' }, reactionsQueue.map(({ reaction, uid }, index) => (react_1.default.createElement(ReactionEmoji_1.default, { index: index, key: uid, reaction: reaction, uid: uid })))));
    }
    return null;
}
exports.default = ReactionAnimations;
