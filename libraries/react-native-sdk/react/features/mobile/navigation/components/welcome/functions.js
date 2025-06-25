"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderArrowBackButton = void 0;
const react_1 = __importDefault(require("react"));
const svg_1 = require("../../../../base/icons/svg");
const HeaderNavigationButton_1 = __importDefault(require("../HeaderNavigationButton"));
/**
 * Render header arrow back button for navigation.
 *
 * @param {Function} onPress - Callback for when the button is pressed
 * function.
 * @returns {ReactElement}
 */
function renderArrowBackButton(onPress) {
    return (<HeaderNavigationButton_1.default onPress={onPress} src={svg_1.IconArrowBack}/>);
}
exports.renderArrowBackButton = renderArrowBackButton;
