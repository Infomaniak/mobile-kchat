/// <reference types="react" />
export interface IProps {
    /**
    * The deviceId of the microphone in use.
    */
    currentMicDeviceId: string;
    /**
    * The deviceId of the output device in use.
    */
    currentOutputDeviceId?: string;
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
     * Whether noise suppression is enabled or not.
     */
    noiseSuppressionEnabled: boolean;
    /**
    * A list of objects containing the labels and deviceIds
    * of all the output devices.
    */
    outputDevices: Array<{
        deviceId: string;
        label: string;
    }>;
    /**
     * Whether the prejoin page is visible or not.
     */
    prejoinVisible: boolean;
    /**
    * Used to set a new microphone as the current one.
    */
    setAudioInputDevice: Function;
    /**
    * Used to set a new output device as the current one.
    */
    setAudioOutputDevice: Function;
    /**
     * Function to toggle noise suppression.
     */
    toggleSuppression: () => void;
}
declare const _default: import("react-redux").ConnectedComponent<({ currentMicDeviceId, currentOutputDeviceId, measureAudioLevels, microphoneDevices, noiseSuppressionEnabled, outputDevices, prejoinVisible, setAudioInputDevice, setAudioOutputDevice, toggleSuppression }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "noiseSuppressionEnabled" | "prejoinVisible" | "toggleSuppression">>;
export default _default;
