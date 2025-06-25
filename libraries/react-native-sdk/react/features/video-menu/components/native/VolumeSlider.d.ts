import React, { PureComponent } from 'react';
/**
 * The type of the React {@code Component} props of {@link VolumeSlider}.
 */
export interface IProps {
    /**
     * Whether the participant enters the conference silent.
     */
    _startSilent?: boolean;
    /**
     * Remote audio track.
     */
    _track?: any;
    /**
     * The volume level for the participant.
     */
    _volume?: number;
    /**
     * The redux dispatch function.
     */
    dispatch?: Function;
    /**
     * The ID of the participant.
     */
    participantID?: string;
}
/**
 * The type of the React {@code Component} state of {@link VolumeSlider}.
 */
export interface IState {
    /**
     * The volume of the participant's audio element. The value will
     * be represented by a slider.
     */
    volumeLevel: number;
}
/**
 * Component that renders the volume slider.
 *
 * @returns {React$Element<any>}
 */
declare class VolumeSlider extends PureComponent<IProps, IState> {
    _originalVolumeChange: Function;
    /**
     * Initializes a new {@code VolumeSlider} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
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
     * Sets the internal state of the volume level for the volume slider.
     * Invokes the prop onVolumeChange to notify of volume changes.
     *
     * @param {number} volumeLevel - Selected volume on slider.
     * @private
     * @returns {void}
     */
    _onVolumeChange(volumeLevel: any): void;
}
declare const _default: import("react-redux").ConnectedComponent<React.JSXElementConstructor<import("react-redux").Matching<{
    _startSilent: boolean;
    _track: import("../../../base/tracks/types").ITrack | undefined;
    _volume: number | "" | undefined;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<VolumeSlider> & IProps>>, (import("react-redux").Omit<import("react-redux").Matching<{
    _startSilent: boolean;
    _track: import("../../../base/tracks/types").ITrack | undefined;
    _volume: number | "" | undefined;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<VolumeSlider> & IProps>, "dispatch" | "_startSilent" | "_track" | "_volume"> | import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-redux").Matching<{
    _startSilent: boolean;
    _track: import("../../../base/tracks/types").ITrack | undefined;
    _volume: number | "" | undefined;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<VolumeSlider> & IProps>, any, any>> & import("react-redux").Matching<{
    _startSilent: boolean;
    _track: import("../../../base/tracks/types").ITrack | undefined;
    _volume: number | "" | undefined;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<VolumeSlider> & IProps>, "dispatch" | "_startSilent" | "_track" | "_volume">) & IProps>;
export default _default;
