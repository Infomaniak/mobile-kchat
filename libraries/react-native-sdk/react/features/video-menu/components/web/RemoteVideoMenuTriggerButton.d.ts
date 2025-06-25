/// <reference types="react" />
import { IStore } from '../../../app/types';
import { IParticipant } from '../../../base/participants/types';
/**
 * The type of the React {@code Component} props of
 * {@link RemoteVideoMenuTriggerButton}.
 */
export interface IProps {
    /**
     * Whether the remote video context menu is disabled.
     */
    _disabled: Boolean;
    /**
     * Shared video local participant owner.
     */
    _localVideoOwner?: boolean;
    /**
     * The position relative to the trigger the remote menu should display
     * from.
     */
    _menuPosition: string;
    /**
     * Participant reference.
     */
    _participant: IParticipant;
    /**
     * The ID for the participant on which the remote video menu will act.
     */
    _participantDisplayName: string;
    /**
     * The current state of the participant's remote control session.
     */
    _remoteControlState?: number;
    /**
     * Whether the popover should render the Connection Info stats.
     */
    _showConnectionInfo: Boolean;
    /**
     * Whether or not the button should be visible.
     */
    buttonVisible: boolean;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Hides popover.
     */
    hidePopover?: Function;
    /**
     * The ID for the participant on which the remote video menu will act.
     */
    participantID: string;
    /**
     * Whether the popover is visible or not.
     */
    popoverVisible?: boolean;
    /**
     * Shows popover.
     */
    showPopover?: Function;
    /**
     * The type of the thumbnail.
     */
    thumbnailType: string;
}
declare const _default: import("react-redux").ConnectedComponent<({ _disabled, _localVideoOwner, _menuPosition, _participant, _participantDisplayName, _remoteControlState, _showConnectionInfo, buttonVisible, dispatch, hidePopover, participantID, popoverVisible, showPopover }: IProps) => JSX.Element | null, import("react-redux").Omit<IProps, "dispatch" | "_participant" | "_disabled" | "_menuPosition" | "_showConnectionInfo" | "_localVideoOwner" | "_participantDisplayName" | "_remoteControlState"> & Partial<IProps>>;
export default _default;
