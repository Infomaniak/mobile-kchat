/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link HangupContextMenuItem}.
 */
export interface IProps {
    /**
     * Accessibility label for the button.
     */
    accessibilityLabel: string;
    /**
     * Key to use for toolbarButtonClicked event.
     */
    buttonKey: string;
    /**
     * Type of button to display.
     */
    buttonType: string;
    /**
     * Text associated with the button.
     */
    label: string;
    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * Callback that performs the actual hangup action.
     */
    onClick: Function;
}
/**
 * Implementation of a button to be rendered within Hangup context menu.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - Button that would trigger the hangup action.
 */
export declare const HangupContextMenuItem: (props: IProps) => JSX.Element;
