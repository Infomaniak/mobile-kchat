"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const functions_web_1 = require("../functions.web");
exports.default = ({ visible, children, id }) => (react_1.default.createElement("div", { className: `subject${(0, functions_web_1.isAlwaysOnTitleBarEmpty)() ? '' : ' with-always-on'}${visible ? ' visible' : ''}`, id: id },
    react_1.default.createElement("div", { className: 'subject-info-container' }, children)));
