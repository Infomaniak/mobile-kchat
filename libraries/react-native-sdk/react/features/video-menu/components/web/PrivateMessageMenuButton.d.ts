import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { IParticipant } from '../../../base/participants/types';
import { IButtonProps } from '../../types';
export interface IProps extends IButtonProps, WithTranslation {
    /**
     * True if the private chat functionality is disabled, hence the button is not visible.
     */
    _hidden: boolean;
    /**
     * The participant to send the message to.
     */
    _participant?: IParticipant;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}
declare const _default: React.ComponentType<import("react-i18next").Omit<any, keyof WithTranslation>>;
export default _default;
