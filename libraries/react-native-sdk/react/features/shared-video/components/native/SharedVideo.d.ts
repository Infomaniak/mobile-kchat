import React, { Component } from 'react';
import { IStore } from '../../../app/types';
export interface IProps {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Is the video shared by the local user.
     *
     * @private
     */
    isOwner: boolean;
    /**
     * True if in landscape mode.
     *
     * @private
     */
    isWideScreen: boolean;
    /**
     * The available player width.
     */
    playerHeight: number;
    /**
     * The available player width.
     */
    playerWidth: number;
    /**
     * The shared video url.
     */
    videoUrl?: string;
}
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
declare class SharedVideo extends Component<IProps> {
    /**
     * Initializes a new {@code SharedVideo} instance.
     *
     * @param {Object} props - The properties.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidUpdate()}.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Dispatches action to set the visibility of the toolbox, true if not widescreen, false otherwise.
     *
     * @param {isWideScreen} isWideScreen - Whether the screen is wide.
     * @private
     * @returns {void}
    */
    setWideScreenMode(isWideScreen: boolean): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof SharedVideo, import("react-redux").Omit<React.ClassAttributes<SharedVideo> & IProps, "dispatch" | "videoUrl" | "isOwner" | "isWideScreen" | "playerHeight" | "playerWidth">>;
export default _default;
