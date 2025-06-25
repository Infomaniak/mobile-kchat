import React, { Component } from 'react';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
export interface IProps {
    /**
     * The conference info labels to be shown in the conference header.
     */
    _conferenceInfo: {
        alwaysVisible?: string[];
        autoHide?: string[];
    };
    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean;
    /**
     * Invoked to active other features of the app.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The upper band of the meeing containing the conference name, timer and labels.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$None}
 */
declare class ConferenceInfo extends Component<IProps> {
    /**
     * Initializes a new {@code ConferenceInfo} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Callback invoked when the component is focused to show the conference
     * info if necessary.
     *
     * @returns {void}
     */
    _onTabIn(): void;
    /**
     * Renders auto-hidden info header labels.
     *
     * @returns {void}
     */
    _renderAutoHide(): JSX.Element | null;
    /**
     * Renders the always visible info header labels.
     *
     * @returns {void}
     */
    _renderAlwaysVisible(): JSX.Element | null;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof ConferenceInfo, import("react-redux").Omit<React.ClassAttributes<ConferenceInfo> & IProps, "dispatch" | "_visible" | "_conferenceInfo">>;
export default _default;
