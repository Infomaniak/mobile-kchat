"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const svg_1 = require("../../../base/icons/svg");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const ParticipantActionEllipsis = ({ accessibilityLabel, onClick, participantID }) => (react_1.default.createElement(Button_1.default, { accessibilityLabel: accessibilityLabel, icon: svg_1.IconDotsHorizontal, onClick: onClick, size: 'small', testId: participantID ? `participant-more-options-${participantID}` : undefined }));
exports.default = ParticipantActionEllipsis;
