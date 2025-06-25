/// <reference types="react" />
export interface IProps {
    /**
     * Whether displaying the current conference timer is enabled or not.
     */
    _conferenceTimerEnabled: boolean;
    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    _createOnPress: Function;
    /**
     * Whether participants feature is enabled or not.
     */
    _isParticipantsPaneEnabled: boolean;
    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string;
    /**
     * Whether displaying the current room name is enabled or not.
     */
    _roomNameEnabled: boolean;
    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<(props: IProps) => JSX.Element | null, import("react-redux").Omit<IProps, "_visible" | "_conferenceTimerEnabled" | "_isParticipantsPaneEnabled" | "_meetingName" | "_roomNameEnabled">>;
export default _default;
