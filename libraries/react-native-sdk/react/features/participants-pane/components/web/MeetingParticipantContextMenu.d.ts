import React from 'react';
import { IStore } from '../../../app/types';
import { IParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * Shared video local participant owner.
     */
    _localVideoOwner: boolean;
    /**
     * Participant reference.
     */
    _participant?: IParticipant;
    /**
     * Closes a drawer if open.
     */
    closeDrawer: () => void;
    /**
     * The dispatch function from redux.
     */
    dispatch: IStore['dispatch'];
    /**
     * The participant for which the drawer is open.
     * It contains the displayName & participantID.
     */
    drawerParticipant: {
        displayName: string;
        participantID: string;
    };
    /**
     * Target elements against which positioning calculations are made.
     */
    offsetTarget?: HTMLElement;
    /**
     * Callback for the mouse entering the component.
     */
    onEnter: (e?: React.MouseEvent) => void;
    /**
     * Callback for the mouse leaving the component.
     */
    onLeave: (e?: React.MouseEvent) => void;
    /**
     * Callback for making a selection in the menu.
     */
    onSelect: (e?: React.MouseEvent | boolean) => void;
    /**
     * The ID of the participant.
     */
    participantID: string;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
