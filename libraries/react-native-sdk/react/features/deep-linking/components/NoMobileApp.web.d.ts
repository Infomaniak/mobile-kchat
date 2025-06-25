import React, { Component } from 'react';
import { IDeeplinkingConfig } from '../../base/config/configType';
/**
 * The type of the React {@code Component} props of
 * {@link NoMobileApp}.
 */
export interface IProps {
    /**
     * The deeplinking config.
     */
    _deeplinkingCfg: IDeeplinkingConfig;
}
/**
 * React component representing no mobile app page.
 *
 * @class NoMobileApp
 */
declare class NoMobileApp extends Component<IProps> {
    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof NoMobileApp, import("react-redux").Omit<React.ClassAttributes<NoMobileApp> & IProps, "_deeplinkingCfg">>;
export default _default;
