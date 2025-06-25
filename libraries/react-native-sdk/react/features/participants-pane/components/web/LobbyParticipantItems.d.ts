import React from 'react';
import { IParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * Opens a drawer with actions for a knocking participant.
     */
    openDrawerForParticipant: Function;
    /**
     * If a drawer with actions should be displayed.
     */
    overflowDrawer: boolean;
    /**
     * List with the knocking participants.
     */
    participants: IParticipant[];
}
declare const _default: React.NamedExoticComponent<IProps>;
export default _default;
