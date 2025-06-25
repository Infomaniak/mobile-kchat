"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BaseTheme_1 = __importDefault(require("../../../base/ui/components/BaseTheme"));
const constants_1 = require("./constants");
const ExpandedLabelPopup = ({ visibleExpandedLabel }) => {
    if (visibleExpandedLabel) {
        const expandedLabel = constants_1.EXPANDED_LABELS[visibleExpandedLabel];
        if (expandedLabel) {
            const LabelComponent = expandedLabel.component;
            const { props, alwaysOn } = expandedLabel;
            const style = {
                top: alwaysOn ? BaseTheme_1.default.spacing[6] : BaseTheme_1.default.spacing[1]
            };
            return (<LabelComponent {...props} style={style}/>);
        }
    }
    return null;
};
exports.default = ExpandedLabelPopup;
