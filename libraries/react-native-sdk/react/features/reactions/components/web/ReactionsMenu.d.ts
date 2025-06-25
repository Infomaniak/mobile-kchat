/// <reference types="react" />
import { IStore } from '../../../app/types';
import { IReactionsMenuParent } from '../../types';
export interface IProps {
    /**
     * Docks the toolbox.
     */
    _dockToolbox: Function;
    /**
     * Whether or not the GIF feature is enabled.
     */
    _isGifEnabled: boolean;
    /**
     * Whether or not the GIF menu is visible.
     */
    _isGifMenuVisible: boolean;
    /**
     * The ID of the local participant.
     */
    _localParticipantID?: string;
    /**
     * Whether or not the local participant's hand is raised.
     */
    _raisedHand: boolean;
    /**
     * The Redux Dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Indicates the parent of the reactions menu.
     */
    parent: IReactionsMenuParent;
    /**
     * Whether to show the raised hand button.
     */
    showRaisedHand?: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<(props: IProps) => JSX.Element, import("react-redux").Omit<IProps, "dispatch" | "_localParticipantID" | "_isGifEnabled" | "_isGifMenuVisible" | "_raisedHand" | "_dockToolbox">>;
export default _default;
