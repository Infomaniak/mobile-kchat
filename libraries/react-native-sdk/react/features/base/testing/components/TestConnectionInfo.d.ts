import React, { Component } from 'react';
/**
 * Defines the TestConnectionInfo's properties.
 */
export interface IProps {
    /**
     * The JitsiConference's connection state. It's the lib-jitsi-meet's event
     * name converted to a string directly. At the time of this writing these
     * are the possible values:
     * 'conference.connectionEstablished'
     * 'conference.connectionInterrupted'
     * 'conference.connectionRestored'.
     */
    _conferenceConnectionState: string;
    /**
     * This will be a boolean converted to a string. The value will be 'true'
     * once the conference is joined (the XMPP MUC room to be specific).
     */
    _conferenceJoinedState: string;
    /**
     * The local participant's ID. Required to be able to observe the local RTP
     * stats.
     */
    _localUserId: string;
    /**
     * The local participant's role.
     */
    _localUserRole: string;
    /**
     * Indicates whether or not the test mode is currently on. Otherwise the
     * TestConnectionInfo component will not render.
     */
    _testMode: boolean;
}
/**
 * Describes the TestConnectionInfo's state.
 */
type State = {
    /**
     * The RTP stats section.
     */
    stats: {
        /**
         * The local bitrate.
         */
        bitrate: {
            /**
             * The local download RTP bitrate.
             */
            download: number;
            /**
             * The local upload RTP bitrate.
             */
            upload: number;
        };
    };
};
/**
 * The component will expose some of the app state to the jitsi-meet-torture
 * through the UI accessibility layer which is visible to the tests. The Web
 * tests currently will execute JavaScript and access globals variables to learn
 * this information, but there's no such option on React Native(maybe that's
 * a good thing).
 */
declare class TestConnectionInfo extends Component<IProps, State> {
    /**
     * Initializes new <tt>TestConnectionInfo</tt> instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * The {@link statsEmitter} callback hoked up for the local participant.
     *
     * @param {Object} stats - These are the RTP stats. Look in
     * the lib-jitsi-meet for more details on the actual structure or add
     * a console print and figure out there.
     * @returns {void}
     * @private
     */
    _onStatsUpdated(stats?: {
        bitrate: {
            download: undefined;
            upload: undefined;
        };
    }): void;
    /**
     * Starts listening for the local RTP stat updates.
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidMount(): void;
    /**
     * Updates which user's stats are being listened to (the local participant's
     * id changes).
     *
     * @inheritdoc
     * returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Removes the local stats listener.
     *
     * @private
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Renders the component if the app is currently running in the test mode
     * (config.testing.testMode == true).
     *
     * @returns {ReactElement|null}
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof TestConnectionInfo, import("react-redux").Omit<React.ClassAttributes<TestConnectionInfo> & IProps, "_conferenceConnectionState" | "_conferenceJoinedState" | "_localUserId" | "_localUserRole" | "_testMode">>;
export default _default;
