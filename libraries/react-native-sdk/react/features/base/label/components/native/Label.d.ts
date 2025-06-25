import { Component } from 'react';
import { Animated } from 'react-native';
import { StyleType } from '../../../styles/functions.native';
export interface IProps {
    /**
     * An SVG icon to be rendered as the content of the label.
     */
    icon?: Function;
    /**
     * Color for the icon.
     */
    iconColor?: string;
    /**
     * Status of the label. This prop adds some additional styles based on its
     * value. E.g. If status = off, it will render the label symbolising that
     * the thing it displays (e.g. Recording) is off.
     */
    status?: 'in_progress' | 'off' | 'on';
    /**
     * Style of the label.
     */
    style?: StyleType;
    /**
     * String or component that will be rendered as the label itself.
     */
    text?: string;
    /**
     * Custom styles for the text.
     */
    textStyle?: StyleType;
}
type State = {
    /**
     * An animation object handling the opacity changes of the in progress
     * label.
     */
    pulseAnimation: Animated.Value;
};
/**
 * Renders a circular indicator to be used for status icons, such as recording
 * on, audio-only conference, video quality and similar.
 */
export default class Label extends Component<IProps, State> {
    /**
     * A reference to the started animation of this label.
     */
    animationReference: Animated.CompositeAnimation;
    /**
     * Instantiates a new instance of {@code Label}.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Implements React {@link Component}'s render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Checks if the animation has to be started or stopped and acts
     * accordingly.
     *
     * @param {IProps} oldProps - The previous values of the Props.
     * @param {IProps} newProps - The new values of the Props.
     * @returns {void}
     */
    _maybeToggleAnimation(oldProps: Partial<IProps>, newProps: IProps): void;
}
export {};
