import React from 'react';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
/**
 * The type of the React {@code Component} props of {@link ScreenSharingIosButton}.
 */
export interface IProps extends AbstractButtonProps {
    /**
     * True if the button needs to be disabled.
     */
    _disabled: boolean;
    /**
     * Whether video is currently muted or not.
     */
    _screensharing: boolean;
}
/**
 * An implementation of a button for toggling screen sharing on iOS.
 */
declare class ScreenSharingIosButton extends AbstractButton<IProps> {
    _nativeComponent: React.Component<any, any> | null;
    accessibilityLabel: string;
    icon: any;
    label: string;
    toggledLabel: string;
    /**
   * Initializes a new {@code ScreenSharingIosButton} instance.
   *
   * @param {Object} props - The React {@code Component} props to initialize
   * the new {@code ScreenSharingIosButton} instance with.
   */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render(): JSX.Element;
    /**
    * Sets the internal reference to the React Component wrapping the
    * {@code RPSystemBroadcastPickerView} component.
    *
    * @param {ReactComponent} component - React Component.
    * @returns {void}
    */
    _setNativeComponent(component: React.Component<any, any> | null): void;
    /**
   * Handles clicking / pressing the button.
   *
   * @override
   * @protected
   * @returns {void}
   */
    _handleClick(): void;
    /**
   * Returns a boolean value indicating if this button is disabled or not.
   *
   * @protected
   * @returns {boolean}
   */
    _isDisabled(): boolean;
    /**
   * Indicates whether this button is in toggled state or not.
   *
   * @override
   * @protected
   * @returns {boolean}
   */
    _isToggled(): boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<Pick<React.ClassAttributes<ScreenSharingIosButton> & IProps, "dispatch" | "t" | "i18n" | "tReady" | "backgroundColor" | "customClass" | "buttonKey" | "contextMenu" | "handleClick" | "isMenuButton" | "notifyMode" | "_disabled" | "_screensharing" | keyof React.ClassAttributes<ScreenSharingIosButton>> & Partial<Pick<React.ClassAttributes<ScreenSharingIosButton> & IProps, "visible" | "showLabel" | "styles" | "tooltipPosition" | "disabledStyles" | "afterClick" | "toggledStyles">> & Partial<Pick<{
    afterClick: undefined;
    disabledStyles: {
        iconStyle: {
            opacity: number;
        };
        labelStyle: {
            opacity: number;
        };
        style: undefined;
        underlayColor: undefined;
    };
    showLabel: boolean;
    styles: undefined;
    toggledStyles: undefined;
    tooltipPosition: string;
    visible: boolean;
}, never>>, "visible" | "dispatch" | "_screensharing">, keyof import("react-i18next").WithTranslation>>;
export default _default;
