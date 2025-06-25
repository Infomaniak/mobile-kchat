import React from 'react';
export interface IProps {
    /**
     * The 'aria-label' text.
     */
    ariaLabel: string;
    /**
     * The maximum value for slider value.
     */
    max: number;
    /**
     * The minimum value for slider value.
     */
    min: number;
    /**
     * Callback invoked on change.
     */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * The granularity that the value must adhere to.
     */
    step: number;
    /**
     * The current value where the knob is positioned.
     */
    value: number;
}
/**
 *  Custom slider.
 *
 *  @returns {ReactElement}
 */
declare function Slider({ ariaLabel, max, min, onChange, step, value }: IProps): JSX.Element;
export default Slider;
