"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const svg_1 = require("../../../base/icons/svg");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/native/BaseIndicator"));
/**
 * Thumbnail badge for displaying if a participant is pinned.
 *
 * @returns {React$Element<any>}
 */
function PinnedIndicator() {
    return (<BaseIndicator_1.default icon={svg_1.IconPin}/>);
}
exports.default = PinnedIndicator;
