"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Abstract (base) class for an item in {@link Toolbox}. The item can be located
 * anywhere in the {@link Toolbox}, it will morph its shape to accommodate it.
 *
 * @abstract
 */
class AbstractToolboxItem extends react_1.Component {
    /**
     * Initializes a new {@code AbstractToolboxItem} instance.
     *
     * @param {Object} props - The React {@code Component} props to initialize
     * the new {@code AbstractToolboxItem} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Helper property to get the item label. If a translation function was
     * provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get label() {
        return this._maybeTranslateAttribute(this.props.label, this.props.labelProps);
    }
    /**
     * Helper property to get the item tooltip. If a translation function was
     * provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get tooltip() {
        return this._maybeTranslateAttribute(this.props.tooltip ?? '');
    }
    /**
     * Helper property to get the item accessibilityLabel. If a translation
     * function was provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get accessibilityLabel() {
        return this._maybeTranslateAttribute(this.props.accessibilityLabel);
    }
    /**
     * Utility function to translate the given string, if a translation
     * function is available.
     *
     * @param {string} text - What needs translating.
     * @param {string} textProps - Additional properties for translation text.
     * @private
     * @returns {string}
     */
    _maybeTranslateAttribute(text, textProps) {
        const { t } = this.props;
        if (textProps) {
            return typeof t === 'function' ? t(text, textProps) : `${text} ${textProps}`;
        }
        return typeof t === 'function' ? t(text) : text;
    }
    /**
     * Handles clicking/pressing this {@code AbstractToolboxItem} by
     * forwarding the event to the {@code onClick} prop of this instance if any.
     *
     * @protected
     * @returns {void}
     */
    _onClick(...args) {
        const { disabled, onClick } = this.props;
        disabled || onClick?.(...args);
    }
    /**
     * Renders this {@code AbstractToolboxItem} (if it is {@code visible}). To
     * be implemented/overridden by extenders. The default implementation of
     * {@code AbstractToolboxItem} does nothing.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderItem() {
        // To be implemented by a subclass.
        return null;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return this.props.visible ? this._renderItem() : null;
    }
}
/**
 * Default values for {@code AbstractToolboxItem} component's properties.
 *
 * @static
 */
AbstractToolboxItem.defaultProps = {
    disabled: false,
    label: '',
    showLabel: false,
    t: undefined,
    tooltip: '',
    tooltipPosition: 'top',
    visible: true
};
exports.default = AbstractToolboxItem;
