import React from 'react';
import AbstractSharedVideoDialog from '../AbstractSharedVideoDialog';
/**
 * Component that renders the video share dialog.
 *
 * @returns {React$Element<any>}
 */
declare class SharedVideoDialog extends AbstractSharedVideoDialog<any> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: any);
    /**
     * Callback for the onChange event of the field.
     *
     * @param {string} value - The static event.
     * @returns {void}
     */
    _onChange(value: string): void;
    /**
     * Callback to be invoked when the value of the link input is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue(): boolean;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<SharedVideoDialog> & import("../AbstractSharedVideoDialog").IProps, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
