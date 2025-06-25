import React from 'react';
export interface IProps {
    /**
     * Accessibility label for button.
     */
    accessibilityLabel: string;
    /**
     * An extra class name to be added at the end of the element's class name
     * in order to enable custom styling.
     */
    customClass?: string;
    /**
     * Whether or not the button is disabled.
     */
    disabled?: boolean;
    /**
     * Button icon.
     */
    icon: Function;
    /**
     * Click handler.
     */
    onClick: (e?: React.MouseEvent) => void;
    /**
     * Whether or not the button is toggled.
     */
    toggled?: boolean;
}
declare const ToolbarButton: ({ accessibilityLabel, customClass, disabled, onClick, icon, toggled }: IProps) => JSX.Element;
export default ToolbarButton;
