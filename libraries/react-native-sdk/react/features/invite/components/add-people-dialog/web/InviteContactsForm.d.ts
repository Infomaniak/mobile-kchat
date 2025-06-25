import { Theme } from '@mui/material';
import React from 'react';
import { IStore } from '../../../../app/types';
import { IProps as AbstractProps } from '../AbstractAddPeopleDialog';
declare const styles: (theme: Theme) => {
    formWrap: {
        marginTop: string;
    };
    inviteButtons: {
        display: string;
        justifyContent: string;
        marginTop: string;
        '& .invite-button': {
            marginLeft: string;
        };
    };
};
export interface IProps extends AbstractProps {
    /**
     * The {@link JitsiMeetConference} which will be used to invite "room" participants.
     */
    _conference?: Object;
    /**
     * Whether the meeting belongs to JaaS user.
     */
    _isVpaas?: boolean;
    /**
     * Css classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-i18next").WithTranslation, keyof import("react-i18next").WithTranslation>>;
export default _default;
