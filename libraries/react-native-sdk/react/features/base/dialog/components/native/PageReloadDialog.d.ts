import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../../app/types';
/**
 * The type of the React {@code Component} props of
 * {@link PageReloadDialog}.
 */
interface IPageReloadDialogProps extends WithTranslation {
    dispatch: IStore['dispatch'];
    isNetworkFailure: boolean;
    reason?: string;
}
/**
 * The type of the React {@code Component} state of
 * {@link PageReloadDialog}.
 */
interface IPageReloadDialogState {
    timeLeft: number;
}
/**
 * Implements a React Component that is shown before the
 * conference is reloaded.
 * Shows a warning message and counts down towards the re-load.
 */
declare class PageReloadDialog extends Component<IPageReloadDialogProps, IPageReloadDialogState> {
    _interval?: number;
    _timeoutSeconds: number;
    /**
     * Initializes a new PageReloadOverlay instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     * @public
     */
    constructor(props: IPageReloadDialogProps);
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Clears the timer interval.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Handle clicking of the "Cancel" button. It will navigate back to the
     * welcome page.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel(): boolean;
    /**
     * Handles automatic reconnection.
     *
     * @private
     * @returns {void}
     */
    _onReconnecting(): void;
    /**
     * Handle clicking on the "Reload Now" button. It will navigate to the same
     * conference URL as before immediately, without waiting for the timer to
     * kick in.
     *
     * @private
     * @returns {boolean}
     */
    _onReloadNow(): boolean;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<PageReloadDialog> & IPageReloadDialogProps, "dispatch" | "reason" | "isNetworkFailure">, keyof WithTranslation>>;
export default _default;
