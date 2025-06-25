import React from 'react';
import { AbstractApp } from './AbstractApp';
import '../middlewares';
import '../reducers';
/**
 * Root app {@code Component} on Web/React.
 *
 * @augments AbstractApp
 */
export declare class App extends AbstractApp {
    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionally)
     * alongside the main element.
     *
     * @abstract
     * @protected
     * @returns {ReactElement}
     */
    _createExtraElement(): JSX.Element;
    /**
     * Overrides the parent method to inject {@link AtlasKitThemeProvider} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component: React.ComponentType, props?: Object): JSX.Element;
    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer(): JSX.Element;
}
