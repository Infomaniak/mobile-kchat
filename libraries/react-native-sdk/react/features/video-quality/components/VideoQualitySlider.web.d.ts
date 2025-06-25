import { Theme } from '@mui/material';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../app/types';
/**
 * The type of the React {@code Component} props of {@link VideoQualitySlider}.
 */
export interface IProps extends WithTranslation {
    /**
     * Whether or not the conference is in audio only mode.
     */
    _audioOnly: Boolean;
    /**
     * The channelLastN value configured for the conference.
     */
    _channelLastN?: number;
    /**
     * Whether or not the conference is in peer to peer mode.
     */
    _p2p?: Object;
    /**
     * The currently configured maximum quality resolution to be sent and
     * received from the remote participants.
     */
    _sendrecvVideoQuality: number;
    /**
     * An object containing the CSS classes.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;
    /**
     * Invoked to request toggling of audio only mode.
     */
    dispatch: IStore['dispatch'];
}
/**
 * Creates the styles for the component.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
declare const styles: (theme: Theme) => {
    dialog: {
        color: string;
    };
    dialogDetails: any;
    dialogContents: {
        background: string;
        padding: string;
    };
    sliderDescription: any;
};
/**
 * Implements a React {@link Component} which displays a slider for selecting a
 * new receive video quality.
 *
 * @augments Component
 */
declare class VideoQualitySlider extends Component<IProps> {
    _sliderOptions: Array<{
        audioOnly?: boolean;
        onSelect: Function;
        textKey: string;
        videoQuality?: number;
    }>;
    /**
     * Initializes a new {@code VideoQualitySlider} instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
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
     * Dispatches an action to enable audio only mode.
     *
     * @private
     * @returns {void}
     */
    _enableAudioOnly(): void;
    /**
     * Handles the action of the high definition video being selected.
     * Dispatches an action to receive high quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableHighDefinition(): void;
    /**
     * Dispatches an action to receive low quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableLowDefinition(): void;
    /**
     * Dispatches an action to receive standard quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableStandardDefinition(): void;
    /**
     * Dispatches an action to receive ultra HD quality video from remote
     * participants.
     *
     * @private
     * @returns {void}
     */
    _enableUltraHighDefinition(): void;
    /**
     * Matches the current video quality state with corresponding index of the
     * component's slider options.
     *
     * @private
     * @returns {void}
     */
    _mapCurrentQualityToSliderValue(): number;
    /**
     * Invokes a callback when the selected video quality changes.
     *
     * @param {Object} event - The slider's change event.
     * @private
     * @returns {void}
     */
    _onSliderChange(event: React.ChangeEvent<HTMLInputElement>): void;
    /**
     * Helper for changing the preferred maximum video quality to receive and
     * disable audio only.
     *
     * @param {number} qualityLevel - The new maximum video quality. Should be
     * a value enumerated in {@code VIDEO_QUALITY_LEVELS}.
     * @private
     * @returns {void}
     */
    _setPreferredVideoQuality(qualityLevel: number): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<VideoQualitySlider> & IProps, "dispatch" | "_audioOnly" | "_channelLastN" | "_p2p" | "_sendrecvVideoQuality">, keyof WithTranslation>>;
export default _default;
