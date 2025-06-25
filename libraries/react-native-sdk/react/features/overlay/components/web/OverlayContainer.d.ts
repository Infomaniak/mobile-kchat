import React, { Component } from 'react';
/**
 * The type of the React {@link Component} props of {@code OverlayContainer}.
 */
export interface IProps {
    /**
     * The React {@link Component} type of overlay to be rendered by the
     * associated {@code OverlayContainer}.
     */
    overlay: any;
}
/**
 * Implements a React {@link Component} that will display the correct overlay
 * when needed.
 */
declare class OverlayContainer extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @public
     * @returns {ReactElement|null}
     */
    render(): React.CElement<{}, React.Component<{}, any, any>> | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof OverlayContainer, import("react-redux").Omit<React.ClassAttributes<OverlayContainer> & IProps, "overlay">>;
export default _default;
