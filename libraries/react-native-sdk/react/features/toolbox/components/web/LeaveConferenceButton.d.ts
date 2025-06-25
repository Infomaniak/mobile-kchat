/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link LeaveConferenceButton}.
 */
export interface IProps {
    /**
     * Key to use for toolbarButtonClicked event.
     */
    buttonKey: string;
    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
}
/**
 * Button to leave the conference.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - The leave conference button.
 */
export declare const LeaveConferenceButton: (props: IProps) => JSX.Element;
