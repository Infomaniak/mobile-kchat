import { ReactNode } from 'react';
export interface IProps {
    /**
    * Component children (the Video button).
    */
    children: ReactNode;
    /**
     * The deviceId of the camera device currently being used.
     */
    currentCameraDeviceId: string;
    /**
    * Flag controlling the visibility of the popup.
    */
    isOpen: boolean;
    /**
    * Callback executed when the popup closes.
    */
    onClose: Function;
    /**
     * The popup placement enum value.
     */
    popupPlacement: string;
    /**
     * Callback invoked to change current camera.
     */
    setVideoInputDevice: Function;
    /**
     * All the camera device ids currently connected.
     */
    videoDeviceIds: string[];
}
/**
 * Popup with a preview of all the video devices.
 *
 * @returns {ReactElement}
 */
declare function VideoSettingsPopup({ currentCameraDeviceId, children, isOpen, onClose, popupPlacement, setVideoInputDevice, videoDeviceIds }: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof VideoSettingsPopup, import("react-redux").Omit<IProps, "onClose" | "isOpen" | "popupPlacement" | "currentCameraDeviceId" | "setVideoInputDevice" | "videoDeviceIds">>;
export default _default;
