"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const svg_1 = require("../../../base/icons/svg");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/web/BaseIndicator"));
/**
 * React {@code Component} for showing a screen-sharing icon with a tooltip.
 *
 * @param {IProps} props - React props passed to this component.
 * @returns {React$Element<any>}
 */
function ScreenShareIndicator(props) {
    return (react_1.default.createElement(BaseIndicator_1.default, { icon: svg_1.IconScreenshare, iconId: 'share-desktop', iconSize: 16, tooltipKey: 'videothumbnail.screenSharing', tooltipPosition: props.tooltipPosition }));
}
exports.default = ScreenShareIndicator;
