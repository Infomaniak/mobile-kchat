"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const tss_react_1 = require("tss-react");
const mui_1 = require("tss-react/mui");
const constants_1 = require("../constants");
/**
 * A component generating all the global styles.
 *
 * @returns {void}
 */
function GlobalStyles() {
    const { theme } = (0, mui_1.useStyles)();
    return (react_1.default.createElement(tss_react_1.GlobalStyles, { styles: (0, constants_1.commonStyles)(theme) }));
}
exports.default = GlobalStyles;
