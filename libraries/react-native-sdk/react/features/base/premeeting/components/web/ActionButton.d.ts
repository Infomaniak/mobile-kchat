import React, { ReactNode } from 'react';
export interface IProps {
    /**
     * Icon to display in the options section.
     */
    OptionsIcon?: Function;
    /**
     * The Label of the child element.
     */
    ariaDropDownLabel?: string;
    /**
     * The Label of the current element.
     */
    ariaLabel?: string;
    /**
     * To give a aria-pressed to the icon.
     */
    ariaPressed?: boolean;
    /**
     * Text of the button.
     */
    children: ReactNode;
    /**
     * Text css class of the button.
     */
    className?: string;
    /**
     * If the button is disabled or not.
     */
    disabled?: boolean;
    /**
     * If the button has options.
     */
    hasOptions?: boolean;
    /**
     * OnClick button handler.
     */
    onClick?: (e?: React.MouseEvent) => void;
    /**
     * Click handler for options.
     */
    onOptionsClick?: (e?: React.KeyboardEvent | React.MouseEvent) => void;
    /**
     * To give a role to the icon.
     */
    role?: string;
    /**
     * To navigate with the keyboard.
     */
    tabIndex?: number;
    /**
     * TestId of the button. Can be used to locate element when testing UI.
     */
    testId?: string;
    /**
     * The type of th button: primary, secondary, text.
     */
    type: string;
}
/**
 * Button used for pre meeting actions.
 *
 * @returns {ReactElement}
 */
declare function ActionButton({ children, className, disabled, hasOptions, OptionsIcon, testId, type, onClick, onOptionsClick, tabIndex, role, ariaPressed, ariaLabel, ariaDropDownLabel }: IProps): JSX.Element;
export default ActionButton;
