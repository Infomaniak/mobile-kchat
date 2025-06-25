import { Route } from '@react-navigation/native';
import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
export interface IProps extends WithTranslation {
    /**
     * The current Jitsi conference.
     */
    conference?: IJitsiConference;
    /**
     * Redux store dispatch method.
     */
    dispatch: IStore['dispatch'];
    /**
     * Window location href.
     */
    locationHref: string;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: any;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    route: Route<'', {
        collabDetails: {
            roomId: string;
            roomKey: string;
        };
        collabServerUrl: string;
        localParticipantName: string;
    }>;
}
/**
 * Implements a React native component that displays the whiteboard page for a specific room.
 */
declare class Whiteboard extends PureComponent<IProps> {
    /**
     * Initializes a new instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to handle the error if the page fails to load.
     *
     * @returns {void}
     */
    _onError(): void;
    /**
     * Callback to intercept navigation inside the webview and make the native app handle the whiteboard requests.
     *
     * NOTE: We don't navigate to anywhere else from that view.
     *
     * @param {any} request - The request object.
     * @returns {boolean}
     */
    _onNavigate(request: {
        url: string;
    }): boolean;
    /**
     * Callback to handle the message events.
     *
     * @param {any} event - The event.
     * @returns {void}
     */
    _onMessage(event: any): void;
    /**
     * Renders the loading indicator.
     *
     * @returns {React$Component<any>}
     */
    _renderLoading(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<Whiteboard> & IProps, "conference" | "dispatch" | "locationHref">, keyof WithTranslation>>;
export default _default;
