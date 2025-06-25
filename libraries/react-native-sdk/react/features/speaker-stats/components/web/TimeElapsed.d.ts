/// <reference types="react" />
/**
 * The type of the React {@code Component} props of {@link TimeElapsed}.
 */
export interface IProps {
    /**
     * The milliseconds to be converted into a human-readable format.
     */
    time: number;
}
/**
 * React component for displaying total time elapsed. Converts a total count of
 * milliseconds into a more humanized form: "# hours, # minutes, # seconds".
 * With a time of 0, "0s" will be displayed.
 *
 * @augments Component
 */
declare const TimeElapsed: ({ time }: IProps) => JSX.Element;
export default TimeElapsed;
