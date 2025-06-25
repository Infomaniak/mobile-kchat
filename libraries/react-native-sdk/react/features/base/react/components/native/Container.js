"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const AbstractContainer_1 = __importDefault(require("../AbstractContainer"));
/**
 * Represents a container of React Native/mobile {@link Component} children.
 *
 * @augments AbstractContainer
 */
class Container extends AbstractContainer_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { accessibilityLabel, accessible, onClick, onLongPress, touchFeedback = Boolean(onClick || onLongPress), underlayColor, visible = true, ...props } = this.props;
        // visible
        if (!visible) {
            return null;
        }
        const onClickOrTouchFeedback = onClick || onLongPress || touchFeedback;
        let element = super._render(react_native_1.View, {
            pointerEvents: onClickOrTouchFeedback ? 'auto' : 'box-none',
            ...props
        });
        // onClick & touchFeedback
        if (element && onClickOrTouchFeedback) {
            const touchableProps = {
                accessibilityLabel,
                accessible,
                onLongPress,
                onPress: onClick
            };
            element
                = touchFeedback
                    ? react_1.default.createElement(react_native_1.TouchableHighlight, {
                        ...touchableProps,
                        underlayColor
                    }, element)
                    : react_1.default.createElement(react_native_1.TouchableWithoutFeedback, touchableProps, element);
        }
        return element;
    }
}
exports.default = Container;
