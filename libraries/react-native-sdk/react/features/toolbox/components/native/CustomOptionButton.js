"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders a custom button.
 *
 * @returns {Component}
 */
class CustomOptionButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.iconSrc = this.props.icon;
        this.id = this.props.id;
        this.text = this.props.text;
        /**
         * Custom icon component.
         *
         * @returns {React.Component}
         */
        this.icon = () => {
            let iconComponent;
            if (!this.iconSrc) {
                return null;
            }
            if (this.iconSrc?.includes('svg')) {
                iconComponent
                    = (<react_native_svg_1.SvgCssUri style={styles_1.default.iconImageStyles} uri={this.iconSrc}/>);
            }
            else {
                iconComponent
                    = (<react_native_1.Image source={{ uri: this.iconSrc }} style={styles_1.default.iconImageStyles} tintColor={'white'}/>);
            }
            return iconComponent;
        };
        this.label = this.text;
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(CustomOptionButton));
