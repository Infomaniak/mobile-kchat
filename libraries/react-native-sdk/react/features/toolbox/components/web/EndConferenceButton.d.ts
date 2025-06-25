/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link EndConferenceButton}.
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
 * Button to end the conference for all participants.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - The end conference button.
 */
export declare const EndConferenceButton: (props: IProps) => JSX.Element;
