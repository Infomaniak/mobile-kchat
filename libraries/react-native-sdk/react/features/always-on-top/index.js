"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const AlwaysOnTop_1 = __importDefault(require("./AlwaysOnTop"));
// Render the main/root Component.
react_dom_1.default.render(react_1.default.createElement(AlwaysOnTop_1.default, null), document.getElementById('react'));
window.addEventListener('beforeunload', () => react_dom_1.default.unmountComponentAtNode(document.getElementById('react') ?? document.body));
