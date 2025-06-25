import React from 'react';
export interface IProps {
    /**
     * Optional label for screen reader users, invisible in the UI.
     *
     * Note: if the text prop is set, a screen reader will first announce
     * the accessibilityText, then the text.
     */
    accessibilityText?: string;
    /**
     * Own CSS class name.
     */
    className?: string;
    /**
     * The color of the label.
     */
    color?: string;
    /**
     * An SVG icon to be rendered as the content of the label.
     */
    icon?: Function;
    /**
     * Color for the icon.
     */
    iconColor?: string;
    /**
     * HTML ID attribute to add to the root of {@code Label}.
     */
    id?: string;
    /**
     * Click handler if any.
     */
    onClick?: (e?: React.MouseEvent) => void;
    /**
     * String or component that will be rendered as the label itself.
     */
    text?: string;
}
declare const Label: ({ accessibilityText, className, color, icon, iconColor, id, onClick, text }: IProps) => JSX.Element;
export default Label;
