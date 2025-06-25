/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link SpeakerEntry}.
 */
export interface IProps {
    /**
     * The text label for the entry.
     */
    children: string;
    /**
     * The deviceId of the speaker.
     */
    deviceId: string;
    /**
     * Flag controlling the selection state of the entry.
     */
    index: number;
    /**
     * Flag controlling the selection state of the entry.
     */
    isSelected: boolean;
    /**
     * Flag controlling the selection state of the entry.
     */
    length: number;
    /**
     * Click handler for the component.
     */
    onClick: Function;
}
/**
 * Implements a React {@link Component} which displays an audio
 * output settings entry. The user can click and play a test sound.
 *
 * @param {IProps} props - Component props.
 * @returns {JSX.Element}
 */
declare const SpeakerEntry: (props: IProps) => JSX.Element;
export default SpeakerEntry;
