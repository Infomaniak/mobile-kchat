import React from 'react';
import { IStore } from '../../../app/types';
import { ILocalParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * The local participant.
     */
    _participant?: ILocalParticipant;
    /**
     * Display name of the participant retrieved from Redux.
     */
    _participantDisplayName: string;
    /**
     * Shows/hides the local switch to visitor button.
     */
    _showDemote: boolean;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Translation function.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
