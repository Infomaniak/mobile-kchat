import React, { Component } from 'react';
/**
 * Constants to describe the dimensions of the video. Landscape videos
 * are wider than they are taller and portrait videos are taller than they
 * are wider. The dimensions will determine how {@code LargeVideoBackground}
 * will stretch to fill its container.
 *
 * @type {Object}
 */
export declare const ORIENTATION: {
    LANDSCAPE: string;
    PORTRAIT: string;
};
/**
 * The type of the React {@code Component} props of
 * {@link LargeVideoBackgroundCanvas}.
 */
export interface IProps {
    /**
     * Whether or not the layout should change to support tile view mode.
     *
     * @protected
     * @type {boolean}
     */
    _shouldDisplayTileView: boolean;
    /**
     * Additional CSS class names to add to the root of the component.
     */
    className: String;
    /**
     * Whether or not the background should have its visibility hidden.
     */
    hidden: boolean;
    /**
     * Whether or not the video should display flipped horizontally, so left
     * becomes right and right becomes left.
     */
    mirror: boolean;
    /**
     * Whether the component should ensure full width of the video is displayed
     * (landscape) or full height (portrait).
     */
    orientationFit: string;
    /**
     * The video stream to display.
     */
    videoElement: HTMLVideoElement;
}
/**
 * Implements a React Component which shows a video element intended to be used
 * as a background to fill the empty space of container with another video.
 *
 * @augments Component
 */
export declare class LargeVideoBackground extends Component<IProps> {
    _canvasEl: HTMLCanvasElement;
    _updateCanvasInterval: number | undefined;
    /**
     * Initializes new {@code LargeVideoBackground} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props: IProps);
    /**
     * If the canvas is not hidden, sets the initial interval to update the
     * image displayed in the canvas.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Starts or stops the interval to update the image displayed in the canvas.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Clears the interval for updating the image displayed in the canvas.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Removes any image displayed on the canvas.
     *
     * @private
     * @returns {void}
     */
    _clearCanvas(): void;
    /**
     * Clears the interval for updating the image displayed in the canvas.
     *
     * @private
     * @returns {void}
     */
    _clearUpdateCanvasInterval(): void;
    /**
     * Sets the instance variable for the component's canvas element so it can
     * be accessed directly for drawing on.
     *
     * @param {Object} element - The DOM element for the component's canvas.
     * @private
     * @returns {void}
     */
    _setCanvasEl(element: HTMLCanvasElement): void;
    /**
     * Starts the interval for updating the image displayed in the canvas.
     *
     * @private
     * @returns {void}
     */
    _setUpdateCanvasInterval(): void;
    /**
     * Draws the current frame of the passed in video element onto the canvas.
     *
     * @private
     * @returns {void}
     */
    _updateCanvas(): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof LargeVideoBackground, import("react-redux").Omit<React.ClassAttributes<LargeVideoBackground> & IProps, "_shouldDisplayTileView">>;
export default _default;
