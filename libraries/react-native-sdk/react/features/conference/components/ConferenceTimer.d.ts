/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link ConferenceTimer}.
 */
export interface IProps {
    /**
     * Style to be applied to the rendered text.
     */
    textStyle?: Object;
}
export interface IDisplayProps {
    /**
     * Style to be applied to text (native only).
     */
    textStyle?: Object;
    /**
     * String to display as time.
     */
    timerValue: string;
}
declare const ConferenceTimer: ({ textStyle }: IProps) => JSX.Element | null;
export default ConferenceTimer;
