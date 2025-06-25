import { Component, ReactNode } from 'react';
/**
 * The type of the React {@code Component} props of {@link OverlayFrame}.
 */
export interface IProps {
    /**
     * The children components to be displayed into the overlay frame.
     */
    children: ReactNode;
    /**
     * Indicates the css style of the overlay. If true, then lighter; darker,
     * otherwise.
     */
    isLightOverlay?: boolean;
    /**
     * The style property.
     */
    style?: Object;
}
/**
 * Implements a React {@link Component} for the frame of the overlays.
 */
export default class OverlayFrame extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render(): JSX.Element;
}
