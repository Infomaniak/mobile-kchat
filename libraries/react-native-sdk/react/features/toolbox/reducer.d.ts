import { IMainToolbarButtonThresholds, NOTIFY_CLICK_MODE } from './types';
export interface IToolboxState {
    buttonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>;
    enabled: boolean;
    fullScreen?: boolean;
    hangupMenuVisible: boolean;
    hovered: boolean;
    mainToolbarButtonsThresholds: IMainToolbarButtonThresholds;
    overflowDrawer: boolean;
    overflowMenuVisible: boolean;
    participantMenuButtonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>;
    shiftUp: boolean;
    timeoutID?: number | null;
    toolbarButtons: Array<string>;
    visible: boolean;
}
