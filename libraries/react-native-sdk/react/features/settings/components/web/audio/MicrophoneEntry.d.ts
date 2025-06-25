/// <reference types="react" />
export interface IProps {
    /**
     * The text for this component.
     */
    children: string;
    /**
     * The deviceId of the microphone.
     */
    deviceId: string;
    /**
     * Flag indicating if there is a problem with the device.
     */
    hasError?: boolean;
    /**
     * Flag indicating if there is a problem with the device.
     */
    index?: number;
    /**
     * Flag indicating the selection state.
     */
    isSelected: boolean;
    /**
     * The audio track for the current entry.
     */
    jitsiTrack: any;
    /**
     * The id for the label, that contains the item text.
     */
    labelId?: string;
    /**
     * The length of the microphone list.
     */
    length: number;
    /**
    * Used to decide whether to listen to audio level changes.
    */
    measureAudioLevels: boolean;
    /**
     * Click handler for component.
     */
    onClick: Function;
}
declare const MicrophoneEntry: ({ deviceId, children, hasError, index, isSelected, length, jitsiTrack, measureAudioLevels, onClick: propsClick }: IProps) => JSX.Element;
export default MicrophoneEntry;
