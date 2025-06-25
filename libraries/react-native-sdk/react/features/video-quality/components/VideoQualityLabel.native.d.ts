import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { StyleType } from '../../base/styles/functions.native';
export interface IProps extends WithTranslation {
    /**
     * Whether or not the conference is in audio only mode.
     */
    _audioOnly: boolean;
    /**
     * Style of the component passed as props.
     */
    style?: StyleType;
}
/**
 * React {@code Component} responsible for displaying a label that indicates
 * the displayed video state of the current conference.
 *
 * NOTE: Due to the lack of actual video quality information on mobile side,
 * this component currently only displays audio only indicator, but the naming
 * is kept consistent with web and in the future we may introduce the required
 * api and extend this component with actual quality indication.
 */
declare class VideoQualityLabel extends Component<IProps> {
    /**
     * Implements React {@link Component}'s render.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<VideoQualityLabel> & IProps, "_audioOnly">, keyof WithTranslation>>;
export default _default;
