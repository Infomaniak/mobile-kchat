import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * True if lobby is currently enabled in the conference.
     */
    _lobbyEnabled: boolean;
    /**
     * True if the section should be visible.
     */
    _visible: boolean;
    /**
     * The Redux Dispatch function.
     */
    dispatch: IStore['dispatch'];
}
export interface IState {
    /**
     * True if the lobby switch is toggled on.
     */
    lobbyEnabled: boolean;
}
/**
 * Implements a security feature section to control lobby mode.
 */
declare class LobbySection extends PureComponent<IProps, IState> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: IProps, state: IState): {
        lobbyEnabled: boolean;
    } | null;
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Callback to be invoked when the user toggles the lobby feature on or off.
     *
     * @returns {void}
     */
    _onToggleLobby(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<LobbySection> & IProps, "dispatch" | "_visible" | "_lobbyEnabled">, keyof WithTranslation>>;
export default _default;
