/// <reference types="react" />
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link LocalVideoMenuTriggerButton}.
 */
export interface IProps {
    /**
     * The id of the local participant.
     */
    _localParticipantId: string;
    /**
     * The position relative to the trigger the local video menu should display
     * from.
     */
    _menuPosition: string;
    /**
     * Whether to display the Popover as a drawer.
     */
    _overflowDrawer: boolean;
    /**
     * Whether to render the connection info pane.
     */
    _showConnectionInfo: boolean;
    /**
     * Shows/hides the local switch to visitor button.
     */
    _showDemote: boolean;
    /**
     * Whether to render the hide self view button.
     */
    _showHideSelfViewButton: boolean;
    /**
     * Shows/hides the local video flip button.
     */
    _showLocalVideoFlipButton: boolean;
    /**
     * Whether to render the pin to stage button.
     */
    _showPinToStage: boolean;
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
declare const _default: import("react-redux").ConnectedComponent<({ _localParticipantId, _menuPosition, _overflowDrawer, _showConnectionInfo, _showDemote, _showHideSelfViewButton, _showLocalVideoFlipButton, _showPinToStage, buttonVisible, dispatch, hidePopover, showPopover, popoverVisible }: IProps) => JSX.Element | null, import("react-redux").Omit<IProps, "dispatch" | "_localParticipantId" | "_menuPosition" | "_overflowDrawer" | "_showConnectionInfo" | "_showDemote" | "_showHideSelfViewButton" | "_showLocalVideoFlipButton" | "_showPinToStage"> & Partial<IProps>>;
export default _default;
