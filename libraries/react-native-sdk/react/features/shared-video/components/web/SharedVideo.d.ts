import React, { Component } from 'react';
export interface IProps {
    /**
     * The available client width.
     */
    clientHeight: number;
    /**
     * The available client width.
     */
    clientWidth: number;
    /**
     * Whether the (vertical) filmstrip is visible or not.
     */
    filmstripVisible: boolean;
    /**
     * The width of the vertical filmstrip.
     */
    filmstripWidth: number;
    /**
     * Is the video shared by the local user.
     */
    isOwner: boolean;
    /**
     * Whether or not the user is actively resizing the filmstrip.
     */
    isResizing: boolean;
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
     * Computes the width and the height of the component.
     *
     * @returns {{
     *  height: number,
     *  width: number
     * }}
     */
    getDimensions(): {
        width: string;
        height: string;
    };
    /**
     * Retrieves the manager to be used for playing the shared video.
     *
     * @returns {Component}
     */
    getManager(): JSX.Element | null;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof SharedVideo, import("react-redux").Omit<React.ClassAttributes<SharedVideo> & IProps, "clientWidth" | "clientHeight" | "videoUrl" | "filmstripWidth" | "filmstripVisible" | "isOwner" | "isResizing">>;
export default _default;
