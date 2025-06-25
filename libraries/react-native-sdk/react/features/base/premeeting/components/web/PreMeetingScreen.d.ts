import { ReactNode } from 'react';
export interface IProps {
    /**
     * The list of toolbar buttons to render.
     */
    _buttons: Array<string>;
    /**
     * The branding background of the premeeting screen(lobby/prejoin).
     */
    _premeetingBackground: string;
    /**
     * The name of the meeting that is about to be joined.
     */
    _roomName: string;
    /**
     * Children component(s) to be rendered on the screen.
     */
    children?: ReactNode;
    /**
     * Additional CSS class names to set on the icon container.
     */
    className?: string;
    /**
     * The name of the participant.
     */
    name?: string;
    /**
     * Indicates whether the copy url button should be shown.
     */
    showCopyUrlButton?: boolean;
    /**
     * Indicates whether the device status should be shown.
     */
    showDeviceStatus: boolean;
    /**
     * Indicates whether to display the recording warning.
     */
    showRecordingWarning?: boolean;
    /**
     * If should show unsafe room warning when joining.
     */
    showUnsafeRoomWarning?: boolean;
    /**
     * The 'Skip prejoin' button to be rendered (if any).
     */
    skipPrejoinButton?: ReactNode;
    /**
     * Whether it's used in the 3rdParty prejoin screen or not.
     */
    thirdParty?: boolean;
    /**
     * Title of the screen.
     */
    title?: string;
    /**
     * True if the preview overlay should be muted, false otherwise.
     */
    videoMuted?: boolean;
    /**
     * The video track to render as preview (if omitted, the default local track will be rendered).
     */
    videoTrack?: Object;
}
declare const _default: import("react-redux").ConnectedComponent<({ _buttons, _premeetingBackground, _roomName, children, className, showDeviceStatus, showRecordingWarning, showUnsafeRoomWarning, skipPrejoinButton, title, videoMuted, videoTrack }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "_buttons" | "_premeetingBackground" | "_roomName"> & Partial<IProps>>;
export default _default;
