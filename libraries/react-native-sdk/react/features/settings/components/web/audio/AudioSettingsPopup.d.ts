import { ReactNode } from 'react';
export interface IProps {
    /**
    * Component's children (the audio button).
    */
    children: ReactNode;
    /**
    * The deviceId of the microphone in use.
    */
    currentMicDeviceId: string;
    /**
    * The deviceId of the output device in use.
    */
    currentOutputDeviceId?: string;
    /**
    * Flag controlling the visibility of the popup.
    */
    isOpen: boolean;
    /**
    * Used to decide whether to measure audio levels for microphone devices.
    */
    measureAudioLevels: boolean;
    /**
    * A list with objects containing the labels and deviceIds
    * of all the input devices.
    */
    microphoneDevices: Array<{
        deviceId: string;
        label: string;
    }>;
    /**
    * Callback executed when the popup closes.
    */
    onClose: Function;
    /**
    * A list of objects containing the labels and deviceIds
    * of all the output devices.
    */
    outputDevices: Array<{
        deviceId: string;
        label: string;
    }>;
    /**
     * The popup placement enum value.
     */
    popupPlacement: string;
    /**
    * Used to set a new microphone as the current one.
    */
    setAudioInputDevice: Function;
    /**
    * Used to set a new output device as the current one.
    */
    setAudioOutputDevice: Function;
}
/**
 * Popup with audio settings.
 *
 * @returns {ReactElement}
 */
declare function AudioSettingsPopup({ children, currentMicDeviceId, currentOutputDeviceId, isOpen, microphoneDevices, setAudioInputDevice, setAudioOutputDevice, onClose, outputDevices, popupPlacement, measureAudioLevels }: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof AudioSettingsPopup, import("react-redux").Omit<IProps, "onClose" | "isOpen" | "measureAudioLevels" | "currentMicDeviceId" | "currentOutputDeviceId" | "microphoneDevices" | "outputDevices" | "setAudioInputDevice" | "setAudioOutputDevice" | "popupPlacement">>;
export default _default;
