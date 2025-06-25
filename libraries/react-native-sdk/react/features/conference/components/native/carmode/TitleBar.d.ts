/// <reference types="react" />
export interface IProps {
    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string;
    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<(props: IProps) => JSX.Element, import("react-redux").Omit<IProps, "_meetingName" | "_meetingNameEnabled">>;
export default _default;
