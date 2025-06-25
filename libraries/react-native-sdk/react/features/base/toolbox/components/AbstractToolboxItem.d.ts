import React, { Component, ReactElement, ReactNode } from 'react';
import { WithTranslation } from 'react-i18next';
import { GestureResponderEvent } from 'react-native';
import type { StyleType } from '../../styles/functions.any';
import { TOOLTIP_POSITION } from '../../ui/constants.any';
export type Styles = {
    /**
     * Style for the item's icon.
     */
    iconStyle?: StyleType;
    /**
     * Style for the item's label.
     */
    labelStyle?: StyleType;
    /**
     * Style for the item itself.
     */
    style?: StyleType;
    /**
     * Color for the item underlay (shows when clicked).
     */
    underlayColor?: string;
};
export interface IProps extends WithTranslation {
    /**
     * A succinct description of what the item does. Used by accessibility
     * tools and torture tests.
     */
    accessibilityLabel: string;
    /**
     * An extra class name to be added at the end of the element's class name
     * in order to enable custom styling.
     */
    customClass?: string;
    /**
     * Whether this item is disabled or not. When disabled, clicking an the item
     * has no effect, and it may reflect on its style.
     */
    disabled: boolean;
    /**
     * A React Element to display at the end of {@code ToolboxItem}.
     */
    elementAfter?: ReactNode;
    /**
     * The icon to render for this {@code ToolboxItem}.
     */
    icon: Function;
    /**
     * The text associated with this item. When `showLabel` is set to
     * {@code true}, it will be displayed alongside the icon.
     */
    label: string;
    labelProps: any;
    /**
     * On click handler.
     */
    onClick: (e?: React.MouseEvent<HTMLElement> | GestureResponderEvent) => void;
    /**
     * Whether to show the label or not.
     */
    showLabel: boolean;
    /**
     * Collection of styles for the item. Used only on native.
     */
    styles?: Styles;
    /**
     * True if the item is toggled, false otherwise.
     */
    toggled?: boolean;
    /**
     * The text to display in the tooltip. Used only on web.
     */
    tooltip?: string;
    /**
     * From which direction the tooltip should appear, relative to the
     * item. Used only on web.
     */
    tooltipPosition: TOOLTIP_POSITION;
    /**
     * Whether this item is visible or not.
     */
    visible: boolean;
}
/**
 * Abstract (base) class for an item in {@link Toolbox}. The item can be located
 * anywhere in the {@link Toolbox}, it will morph its shape to accommodate it.
 *
 * @abstract
 */
export default class AbstractToolboxItem<P extends IProps> extends Component<P> {
    /**
     * Default values for {@code AbstractToolboxItem} component's properties.
     *
     * @static
     */
    static defaultProps: {
        disabled: boolean;
        label: string;
        showLabel: boolean;
        t: undefined;
        tooltip: string;
        tooltipPosition: string;
        visible: boolean;
    };
    /**
     * Initializes a new {@code AbstractToolboxItem} instance.
     *
     * @param {Object} props - The React {@code Component} props to initialize
     * the new {@code AbstractToolboxItem} instance with.
     */
    constructor(props: P);
    /**
     * Helper property to get the item label. If a translation function was
     * provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get label(): string | undefined;
    /**
     * Helper property to get the item tooltip. If a translation function was
     * provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get tooltip(): string | undefined;
    /**
     * Helper property to get the item accessibilityLabel. If a translation
     * function was provided then it will be translated using it.
     *
     * @protected
     * @returns {?string}
     */
    get accessibilityLabel(): string;
    /**
     * Utility function to translate the given string, if a translation
     * function is available.
     *
     * @param {string} text - What needs translating.
     * @param {string} textProps - Additional properties for translation text.
     * @private
     * @returns {string}
     */
    _maybeTranslateAttribute(text: string, textProps?: any): string;
    /**
     * Handles clicking/pressing this {@code AbstractToolboxItem} by
     * forwarding the event to the {@code onClick} prop of this instance if any.
     *
     * @protected
     * @returns {void}
     */
    _onClick(...args: any): void;
    /**
     * Renders this {@code AbstractToolboxItem} (if it is {@code visible}). To
     * be implemented/overridden by extenders. The default implementation of
     * {@code AbstractToolboxItem} does nothing.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderItem(): ReactElement | null;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}
