import React from 'react';
import AbstractHighlightButton, { IProps as AbstractProps } from '../AbstractHighlightButton';
export interface IProps extends AbstractProps {
    _disabled: boolean;
    /**
     * Flag controlling visibility of the component.
     */
    _visible: boolean;
}
/**
 * React {@code Component} responsible for displaying an action that
 * allows users to highlight a meeting moment.
 */
export declare class HighlightButton extends AbstractHighlightButton<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<HighlightButton> & IProps, "dispatch" | "_disabled" | "_visible" | "_isHighlightInProgress">, keyof import("react-i18next").WithTranslation>>;
export default _default;
