/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link VideoSettingsContent}.
 */
export interface IProps {
    /**
     * Callback to change the flip state.
     */
    changeFlip: (flip: boolean) => void;
    /**
     * The deviceId of the camera device currently being used.
     */
    currentCameraDeviceId: string;
    /**
     * Whether or not the local video is flipped.
     */
    localFlipX: boolean;
    /**
     * Open virtual background dialog.
     */
    selectBackground: () => void;
    /**
     * Callback invoked to change current camera.
     */
    setVideoInputDevice: Function;
    /**
     * Callback invoked to toggle the settings popup visibility.
     */
    toggleVideoSettings: Function;
    /**
     * All the camera device ids currently connected.
     */
    videoDeviceIds: string[];
    /**
    * Whether or not the virtual background is visible.
    */
    visibleVirtualBackground: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<({ changeFlip, currentCameraDeviceId, localFlipX, selectBackground, setVideoInputDevice, toggleVideoSettings, videoDeviceIds, visibleVirtualBackground }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "localFlipX" | "changeFlip" | "selectBackground" | "visibleVirtualBackground">>;
export default _default;
