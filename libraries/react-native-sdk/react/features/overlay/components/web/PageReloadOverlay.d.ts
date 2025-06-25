import React from 'react';
import AbstractPageReloadOverlay, { IProps } from './AbstractPageReloadOverlay';
/**
 * Implements a React Component for page reload overlay. Shown before the
 * conference is reloaded. Shows a warning message and counts down towards the
 * reload.
 */
declare class PageReloadOverlay extends AbstractPageReloadOverlay<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<PageReloadOverlay> & IProps, "details" | "error" | "dispatch" | "isNetworkFailure" | "reason">, keyof import("react-i18next").WithTranslation>>;
export default _default;
