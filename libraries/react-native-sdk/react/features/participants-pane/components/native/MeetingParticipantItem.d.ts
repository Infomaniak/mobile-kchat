import React from 'react';
import { IStore } from '../../../app/types';
import { FakeParticipant, IParticipant } from '../../../base/participants/types';
import type { MediaState } from '../../constants';
export interface IProps {
    /**
     * Media state for audio.
     */
    _audioMediaState: MediaState;
    /**
     * Whether or not to disable the moderator indicator.
     */
    _disableModeratorIndicator?: boolean;
    /**
     * The display name of the participant.
     */
    _displayName: string;
    /**
     * The type of fake participant.
     */
    _fakeParticipant: FakeParticipant;
    /**
     * Whether or not the user is a moderator.
     */
    _isModerator: boolean;
    /**
     * True if the participant is the local participant.
     */
    _local: boolean;
    /**
     * Shared video local participant owner.
     */
    _localVideoOwner: boolean;
    /**
     * The participant ID.
     */
    _participantID: string;
    /**
     * True if the participant have raised hand.
     */
    _raisedHand: boolean;
    /**
     * Media state for video.
     */
    _videoMediaState: MediaState;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The participant.
     */
    participant?: IParticipant;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
