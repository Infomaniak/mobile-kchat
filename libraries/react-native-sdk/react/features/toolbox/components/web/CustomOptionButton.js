"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
/**
 * Component that renders a custom toolbox button.
 *
 * @returns {Component}
 */
class CustomOptionButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.iconSrc = this.props.icon;
        this.id = this.props.id;
        this.text = this.props.text;
        this.backgroundColor = this.props.backgroundColor;
        this.accessibilityLabel = this.text;
        /**
         * Custom icon component.
         *
         * @param {any} props - Icon's props.
         * @returns {img}
         */
        this.icon = (props) => (react_1.default.createElement("img", { src: this.iconSrc, ...props }));
        this.label = this.text;
        this.tooltip = this.text;
    }
}
exports.default = CustomOptionButton;
