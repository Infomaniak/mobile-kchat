/// <reference types="react" />
export interface IProps {
    /**
     * Own class name for the component.
     */
    className: string;
    /**
     * Flag indicating whether the component is greyed out/disabled.
     */
    isDisabled?: boolean;
    /**
     * The level of the meter.
     * Should be between 0 and 7 as per the used SVG.
     */
    level: number;
}
/**
 * React {@code Component} representing an audio level meter.
 *
 * @returns { ReactElement}
 */
export default function ({ className, isDisabled, level }: IProps): JSX.Element;
