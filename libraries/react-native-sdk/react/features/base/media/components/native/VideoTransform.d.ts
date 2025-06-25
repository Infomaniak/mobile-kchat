import React, { Component } from 'react';
/**
 * Type of a transform object this component is capable of handling.
 */
type Transform = {
    scale: number;
    translateX: number;
    translateY: number;
};
export interface IProps {
    /**
     * The current aspect ratio of the screen.
     */
    _aspectRatio: Symbol;
    /**
     * Action to dispatch when the component is unmounted.
     */
    _onUnmount: Function;
    /**
     * The stored transforms retrieved from Redux to be initially applied
     * to different streams.
     */
    _transforms: Object;
    /**
     * The children components of this view.
     */
    children: Object;
    /**
     * Transformation is only enabled when this flag is true.
     */
    enabled: boolean;
    /**
     * Function to invoke when a press event is detected.
     */
    onPress?: Function;
    /**
     * The id of the current stream that is displayed.
     */
    streamId: string;
    /**
     * Style of the top level transformable view.
     */
    style: Object;
}
export interface IState {
    /**
     * The current (non-transformed) layout of the View.
     */
    layout: any;
    /**
     * The current transform that is applied.
     */
    transform: Transform;
}
/**
 * An container that captures gestures such as pinch&zoom, touch or move.
 */
declare class VideoTransform extends Component<IProps, IState> {
    /**
     * The gesture handler object.
     */
    gestureHandlers: any;
    /**
     * The initial distance of the fingers on pinch start.
     */
    initialDistance?: number;
    /**
     * The initial position of the finger on touch start.
     */
    initialPosition: {
        x: number;
        y: number;
    };
    /**
     * The actual move threshold that is calculated for this device/screen.
     */
    moveThreshold: number;
    /**
     * Time of the last tap.
     */
    lastTap: number;
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps, prevState: IState): void;
    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Renders the empty component that captures the gestures.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Calculates the new transformation to be applied by merging the current
     * transform values with the newly received incremental values.
     *
     * @param {Transform} transform - The new transform object.
     * @private
     * @returns {Transform}
     */
    _calculateTransformIncrement(transform: Transform): {
        scale: number;
        translateX: number;
        translateY: number;
    };
    /**
     * Determines if there was large enough movement to be handled.
     *
     * @param {Object} gestureState - The gesture state.
     * @returns {boolean}
     */
    _didMove({ dx, dy }: any): boolean;
    /**
     * Returns the stored transform a stream should display with initially.
     *
     * @param {string} streamId - The id of the stream to match with a stored
     * transform.
     * @private
     * @returns {Object | null}
     */
    _getSavedTransform(streamId: string): any;
    /**
     * Calculates the touch distance on a pinch event.
     *
     * @param {Object} evt - The touch event.
     * @private
     * @returns {number}
     */
    _getTouchDistance({ nativeEvent: { touches } }: any): number;
    /**
     * Calculates the position of the touch event.
     *
     * @param {Object} evt - The touch event.
     * @private
     * @returns {Object}
     */
    _getTouchPosition({ nativeEvent: { touches } }: any): {
        x: any;
        y: any;
    };
    /**
     * Generates a transform style object to be used on the component.
     *
     * @returns {{string: Array<{string: number}>}}
     */
    _getTransformStyle(): {
        transform: ({
            scale: number;
            translateX?: undefined;
            translateY?: undefined;
        } | {
            translateX: number;
            scale?: undefined;
            translateY?: undefined;
        } | {
            translateY: number;
            scale?: undefined;
            translateX?: undefined;
        })[];
    } | null;
    /**
     * Limits the move matrix and then applies the transformation to the
     * component (updates state).
     *
     * Note: Points A (top-left) and D (bottom-right) are opposite points of
     * the View rectangle.
     *
     * @param {Transform} transform - The transformation object.
     * @private
     * @returns {void}
     */
    _limitAndApplyTransformation(transform: Transform): void;
    /**
     * Handles gestures and converts them to transforms.
     *
     * Currently supported gestures:
     *  - scale (punch&zoom-type scale).
     *  - move
     *  - press.
     *
     * Note: This component supports onPress solely to overcome the problem of
     * not being able to register gestures via the PanResponder due to the fact
     * that the entire Conference component was a single touch responder
     * component in the past (see base/react/.../Container with an onPress
     * event) - and stock touch responder components seem to have exclusive
     * priority in handling touches in React.
     *
     * @param {string} type - The type of the gesture.
     * @param {?Object | number} value - The value of the gesture, if any.
     * @returns {void}
     */
    _onGesture(type: string, value?: any): void;
    /**
     * Callback for the onLayout of the component.
     *
     * @param {Object} event - The native props of the onLayout event.
     * @private
     * @returns {void}
     */
    _onLayout({ nativeEvent: { layout: { x, y, width, height } } }: any): void;
    /**
     * Function to decide whether the responder should respond to a move event.
     *
     * @param {Object} evt - The event.
     * @param {Object} gestureState - Gesture state.
     * @private
     * @returns {boolean}
     */
    _onMoveShouldSetPanResponder(evt: Object, gestureState: any): boolean;
    /**
     * Calculates the initial touch distance.
     *
     * @param {Object} evt - Touch event.
     * @param {Object} gestureState - Gesture state.
     * @private
     * @returns {void}
     */
    _onPanResponderGrant(evt: Object, { numberActiveTouches }: any): void;
    /**
     * Handles the PanResponder move (touch move) event.
     *
     * @param {Object} evt - Touch event.
     * @param {Object} gestureState - Gesture state.
     * @private
     * @returns {void}
     */
    _onPanResponderMove(evt: Object, gestureState: any): void;
    /**
     * Handles the PanResponder gesture end event.
     *
     * @private
     * @returns {void}
     */
    _onPanResponderRelease(): void;
    /**
     * Function to decide whether the responder should respond to a start
     * (touch) event.
     *
     * @private
     * @returns {boolean}
     */
    _onStartShouldSetPanResponder(): boolean;
    /**
     * Restores the last applied transform when the component is mounted, or
     * a new stream is about to be rendered.
     *
     * @param {string} streamId - The stream id to restore transform for.
     * @private
     * @returns {void}
     */
    _restoreTransform(streamId: string): void;
    /**
     * Stores/saves the a transform when the component is destroyed, or a
     * new stream is about to be rendered.
     *
     * @param {string} streamId - The stream id associated with the transform.
     * @param {Object} transform - The {@Transform} to save.
     * @private
     * @returns {void}
     */
    _storeTransform(streamId: string, transform: Transform): void;
}
declare const _default: import("react-redux").ConnectedComponent<typeof VideoTransform, import("react-redux").Omit<React.ClassAttributes<VideoTransform> & IProps, "_aspectRatio" | "_onUnmount" | "_transforms">>;
export default _default;
