import React from 'react';
import AbstractVideoTrack, { IProps } from '../AbstractVideoTrack';
/**
 * Component that renders video element for a specified video track.
 *
 * @augments AbstractVideoTrack
 */
declare class VideoTrack extends AbstractVideoTrack<IProps> {
    /**
     * Renders the video element for the associated video track.
     *
     * @override
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof VideoTrack, import("react-redux").Omit<React.ClassAttributes<VideoTrack> & IProps, "dispatch">>;
export default _default;
