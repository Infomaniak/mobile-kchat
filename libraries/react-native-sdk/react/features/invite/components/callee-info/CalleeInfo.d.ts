import React, { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link CalleeInfo}.
 */
export interface IProps {
    /**
     * The callee's information such as display name.
     */
    _callee?: {
        id: string;
        name: string;
        status?: string;
    };
    _isVideoMuted: boolean;
}
/**
 * Implements a React {@link Component} which depicts the establishment of a
 * call with a specific remote callee.
 *
 * @augments Component
 */
declare class CalleeInfo extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Attempts to convert specified CSS class names into React
     * {@link Component} props {@code style} or {@code className}.
     *
     * @param {Array<string>} classNames - The CSS class names to convert
     * into React {@code Component} props {@code style} or {@code className}.
     * @returns {{
     *     className: string,
     *     style: Object
     * }}
     */
    _style(...classNames: Array<string | undefined>): {
        className: string;
        style: {};
    };
}
declare const _default: import("react-redux").ConnectedComponent<typeof CalleeInfo, import("react-redux").Omit<React.ClassAttributes<CalleeInfo> & IProps, "_callee" | "_isVideoMuted">>;
export default _default;
