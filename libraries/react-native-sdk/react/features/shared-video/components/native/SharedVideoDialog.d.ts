import React from 'react';
import AbstractSharedVideoDialog, { IProps } from '../AbstractSharedVideoDialog';
export interface IState {
    error: boolean;
}
/**
 * Implements a component to render a display name prompt.
 */
declare class SharedVideoDialog extends AbstractSharedVideoDialog<IState> {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Callback to be invoked when the value of the link input is submitted.
     *
     * @param {string} value - The entered video link.
     * @returns {boolean}
     */
    _onSubmitValue(value: string): boolean;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<SharedVideoDialog> & IProps, "dispatch">, keyof import("react-i18next").WithTranslation>>;
export default _default;
