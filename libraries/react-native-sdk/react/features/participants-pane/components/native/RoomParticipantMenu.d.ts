import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
export interface IProps extends WithTranslation {
    /**
     * The list of all breakout rooms.
     */
    _rooms: Array<any>;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The jid of the selected participant.
     */
    participantJid: string;
    /**
     * The display name of the selected participant.
     */
    participantName: string;
    /**
     * The room the participant is in.
     */
    room: any;
}
/**
 * Class to implement a popup menu that opens upon long pressing a thumbnail.
 */
declare class RoomParticipantMenu extends PureComponent<IProps> {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to hide the {@code RemoteVideoMenu}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel(): void;
    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<RoomParticipantMenu> & IProps, "dispatch" | "_rooms">, keyof WithTranslation>>;
export default _default;
