"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const svg_1 = require("../../../base/icons/svg");
const BaseIndicator_1 = __importDefault(require("../../../base/react/components/web/BaseIndicator"));
/**
 * React {@code Component} for showing a moderator icon with a tooltip.
 *
 * @returns {JSX.Element}
 */
const ModeratorIndicator = ({ tooltipPosition }) => (react_1.default.createElement(BaseIndicator_1.default, { icon: svg_1.IconModerator, iconSize: 16, tooltipKey: 'videothumbnail.moderator', tooltipPosition: tooltipPosition }));
exports.default = ModeratorIndicator;
