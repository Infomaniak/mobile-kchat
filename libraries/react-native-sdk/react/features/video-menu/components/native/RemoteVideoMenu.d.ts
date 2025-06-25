import React from 'react';
import { IStore } from '../../../app/types';
import { IRoom } from '../../../breakout-rooms/types';
export interface IProps {
    /**
     * The id of the current room.
     */
    _currentRoomId: string;
    /**
     * Whether or not to display the grant moderator button.
     */
    _disableGrantModerator: boolean;
    /**
     * Whether or not to display the kick button.
     */
    _disableKick: boolean;
    /**
     * Whether or not to display the send private message button.
     */
    _disablePrivateChat: boolean;
    /**
     * Whether or not to display the remote mute buttons.
     */
    _disableRemoteMute: boolean;
    /**
     * Whether or not the current room is a breakout room.
     */
    _isBreakoutRoom: boolean;
    /**
     * Whether the participant is present in the room or not.
     */
    _isParticipantAvailable?: boolean;
    /**
     * Whether the local participant is moderator or not.
     */
    _moderator: boolean;
    /**
     * Display name of the participant retrieved from Redux.
     */
    _participantDisplayName: string;
    /**
     * Array containing the breakout rooms.
     */
    _rooms: Array<IRoom>;
    /**
     * Whether to display the demote button.
     */
    _showDemote: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the participant for which this menu opened for.
     */
    participantId: string;
    /**
     * Translation function.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
