import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * Props type of the component.
 */
export interface IProps extends WithTranslation {
    /**
     * Control for invite other button.
     */
    _inviteOthersControl: any;
    /**
     * Checks if add-people feature is enabled.
     */
    _isAddPeopleFeatureEnabled: boolean;
    /**
     * True if currently in a breakout room.
     */
    _isInBreakoutRoom: boolean;
    /**
     * True if the invite functions (dial out, invite, share...etc) are disabled.
     */
    _isInviteFunctionsDisabled: boolean;
    /**
     * True if it's a lonely meeting (participant count excluding fakes is 1).
     */
    _isLonelyMeeting: boolean;
    /**
     * The Redux Dispatch function.
     */
    dispatch: IStore['dispatch'];
}
declare const _default: import("react-redux").ConnectedComponent<React.ComponentType<import("react-i18next").Omit<IProps, keyof WithTranslation>>, import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-i18next").Omit<IProps, keyof WithTranslation>, any, any>> & import("react-i18next").Omit<IProps, keyof WithTranslation>, "dispatch" | "_inviteOthersControl" | "_isAddPeopleFeatureEnabled" | "_isInBreakoutRoom" | "_isInviteFunctionsDisabled" | "_isLonelyMeeting"> | import("react-redux").Omit<import("react-i18next").Omit<IProps, keyof WithTranslation> & {
    children?: React.ReactNode;
}, "dispatch" | "_inviteOthersControl" | "_isAddPeopleFeatureEnabled" | "_isInBreakoutRoom" | "_isInviteFunctionsDisabled" | "_isLonelyMeeting">>;
export default _default;
