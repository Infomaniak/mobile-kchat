import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@code CalleeInfoContainer}.
 */
export interface IProps {
    /**
     * The indicator which determines whether {@code CalleeInfo} is to be
     * rendered.
     *
     * @private
     */
    _calleeInfoVisible: boolean;
}
/**
 * Implements a React {@link Component} which depicts the establishment of a
 * call with a specific remote callee if there is such a remote callee.
 *
 * @augments Component
 */
declare class CalleeInfoContainer extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: import("react-redux").ConnectedComponent<typeof CalleeInfoContainer, import("react-redux").Omit<React.ClassAttributes<CalleeInfoContainer> & IProps, "_calleeInfoVisible">>;
export default _default;
