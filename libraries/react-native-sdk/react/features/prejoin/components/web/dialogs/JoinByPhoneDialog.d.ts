import React, { PureComponent } from 'react';
export interface IProps {
    /**
     * The number to call in order to join the conference.
     */
    dialInNumber: string | null;
    /**
     * The action by which the meeting calls the user.
     */
    dialOut: Function;
    /**
     * The number the conference should call.
     */
    dialOutNumber: string;
    /**
     * The status of the call when the meeting calls the user.
     */
    dialOutStatus: string;
    /**
     * Fetches conference dial in numbers & conference id.
     */
    fetchConferenceDetails: Function;
    /**
     * Joins the conference without audio.
     */
    joinConferenceWithoutAudio: Function;
    /**
     * Closes the dialog.
     */
    onClose: (e?: React.MouseEvent) => void;
    /**
     * Opens a web page with all the dial in numbers.
     */
    openDialInPage: (e?: React.MouseEvent) => void;
    /**
     * The passCode of the conference used when joining a meeting by phone.
     */
    passCode?: string | number;
}
type State = {
    /**
     * The dialout call is ongoing, 'CallingDialog' is shown;.
     */
    isCalling: boolean;
    /**
     * If should show 'DialInDialog'.
     */
    showDialIn: boolean;
    /**
     * If should show 'DialOutDialog'.
     */
    showDialOut: boolean;
};
/**
 * This is the dialog shown when a user wants to join with phone audio.
 */
declare class JoinByPhoneDialog extends PureComponent<IProps, State> {
    /**
     * Initializes a new {@code JoinByPhoneDialog} instance.
     *
     * @param {IProps} props - The props of the component.
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Meeting calls the user & shows the 'CallingDialog'.
     *
     * @returns {void}
     */
    _dialOut(): void;
    /**
     * Shows the 'DialInDialog'.
     *
     * @returns {void}
     */
    _showDialInDialog(): void;
    /**
     * Shows the 'DialOutDialog'.
     *
     * @returns {void}
     */
    _showDialOutDialog(): void;
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof JoinByPhoneDialog, any>;
export default _default;
