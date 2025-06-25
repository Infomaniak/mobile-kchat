import React from 'react';
import AbstractStreamKeyForm, { IProps as AbstractProps } from '../AbstractStreamKeyForm';
export interface IProps extends AbstractProps {
    /**
     * Style of the dialogs feature.
     */
    _dialogStyles: any;
}
/**
 * A React Component for entering a key for starting a YouTube live stream.
 *
 * @augments Component
 */
declare class StreamKeyForm extends AbstractStreamKeyForm<IProps> {
    /**
     * Initializes a new {@code StreamKeyForm} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code StreamKeyForm} instance with.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Opens the Google Privacy Policy web page.
     *
     * @private
     * @returns {void}
     */
    _onOpenGooglePrivacyPolicy(): void;
    /**
     * Opens the information link on how to manually locate a YouTube broadcast
     * stream key.
     *
     * @private
     * @returns {void}
     */
    _onOpenHelp(): void;
    /**
     * Opens the YouTube terms and conditions web page.
     *
     * @private
     * @returns {void}
     */
    _onOpenYoutubeTerms(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<StreamKeyForm> & IProps, "_dialogStyles" | "_liveStreaming">, keyof import("react-i18next").WithTranslation>>;
export default _default;
