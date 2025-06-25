import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
import { IReactionEmojiProps } from '../../constants';
export interface IProps extends WithTranslation {
    /**
     * Whether a mobile browser is used or not.
     */
    _isMobile: boolean;
    /**
     * Whether the reactions should be displayed on separate button or not.
     */
    _reactionsButtonEnabled: boolean;
    /**
     * The button's key.
     */
    buttonKey?: string;
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Whether or not it's narrow mode or mobile browser.
     */
    isNarrow: boolean;
    /**
     * Whether or not the reactions menu is open.
     */
    isOpen: boolean;
    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * The array of reactions to be displayed.
     */
    reactionsQueue: Array<IReactionEmojiProps>;
    /**
     * Whether or not to show the raise hand button.
     */
    showRaiseHand?: boolean;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<IProps, "dispatch" | "isOpen" | "_reactionsButtonEnabled" | "_isMobile" | "isNarrow" | "reactionsQueue">, keyof WithTranslation>>;
export default _default;
