import { Route } from '@react-navigation/native';
import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../../app/types';
export interface IProps extends WithTranslation {
    dispatch: IStore['dispatch'];
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation: any;
    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    route: Route<'', {
        summaryUrl: string;
    }>;
}
/**
 * Implements a React native component that displays the dial in info page for a specific room.
 */
declare class DialInSummary extends PureComponent<IProps> {
    /**
     * Initializes a new instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Callback to handle the error if the page fails to load.
     *
     * @returns {void}
     */
    _onError(): void;
    /**
     * Callback to intercept navigation inside the webview and make the native app handle the dial requests.
     *
     * NOTE: We don't navigate to anywhere else form that view.
     *
     * @param {any} request - The request object.
     * @returns {boolean}
     */
    _onNavigate(request: {
        url: string;
    }): boolean;
    /**
     * Renders the loading indicator.
     *
     * @returns {React$Component<any>}
     */
    _renderLoading(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DialInSummary> & IProps, "dispatch">, keyof WithTranslation>>;
export default _default;
