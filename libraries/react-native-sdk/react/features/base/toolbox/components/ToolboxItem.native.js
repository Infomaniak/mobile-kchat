"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../icons/components/Icon"));
const AbstractToolboxItem_1 = __importDefault(require("./AbstractToolboxItem"));
/**
 * Native implementation of {@code AbstractToolboxItem}.
 */
class ToolboxItem extends AbstractToolboxItem_1.default {
    /**
     * Renders the {@code Icon} part of this {@code ToolboxItem}.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderIcon() {
        const { styles } = this.props;
        return (<Icon_1.default src={this.props.icon} style={styles?.iconStyle}/>);
    }
    /**
     * Renders this {@code ToolboxItem}. Invoked by {@link AbstractToolboxItem}.
     *
     * @override
     * @protected
     * @returns {ReactElement}
     */
    _renderItem() {
        const { disabled, elementAfter, onClick, showLabel, styles, toggled } = this.props;
        let children = this._renderIcon();
        // XXX When using a wrapper View, apply the style to it instead of
        // applying it to the TouchableHighlight.
        let style = styles?.style;
        if (showLabel) {
            // XXX TouchableHighlight requires 1 child. If there's a need to
            // show both the icon and the label, then these two need to be
            // wrapped in a View.
            children = (<react_native_1.View style={style}>
                    {children}
                    <react_native_1.Text style={styles?.labelStyle}>
                        {this.label}
                    </react_native_1.Text>
                    {elementAfter}
                </react_native_1.View>);
            // XXX As stated earlier, the style was applied to the wrapper View
            // (above).
            style = undefined;
        }
        return (<react_native_1.TouchableHighlight accessibilityLabel={this.accessibilityLabel} accessibilityRole='button' accessibilityState={{ 'selected': Boolean(toggled) }} disabled={disabled} onPress={onClick} style={style} underlayColor={styles?.underlayColor}>
                {children}
            </react_native_1.TouchableHighlight>);
    }
}
exports.default = ToolboxItem;
