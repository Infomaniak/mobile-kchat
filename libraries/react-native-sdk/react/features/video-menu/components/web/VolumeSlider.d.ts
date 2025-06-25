/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link VolumeSlider}.
 */
export interface IProps {
    /**
     * The value of the audio slider should display at when the component first
     * mounts. Changes will be stored in state. The value should be a number
     * between 0 and 1.
     */
    initialValue: number;
    /**
     * The callback to invoke when the audio slider value changes.
     */
    onChange: Function;
}
declare const VolumeSlider: ({ initialValue, onChange }: IProps) => JSX.Element;
export default VolumeSlider;
