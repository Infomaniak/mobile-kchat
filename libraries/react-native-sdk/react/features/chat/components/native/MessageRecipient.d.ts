import React from 'react';
import { IStore } from '../../../app/types';
import { ILocalParticipant } from '../../../base/participants/types';
import { IProps as AbstractProps } from '../AbstractMessageRecipient';
export interface IProps extends AbstractProps {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
 * Is lobby messaging active.
 */
    isLobbyChatActive: boolean;
    /**
     * The participant string for lobby chat messaging.
     */
    lobbyMessageRecipient?: {
        id: string;
        name: string;
    } | ILocalParticipant;
    /**
     * The participant object set for private messaging.
     */
    privateMessageRecipient: {
        name: string;
    };
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
