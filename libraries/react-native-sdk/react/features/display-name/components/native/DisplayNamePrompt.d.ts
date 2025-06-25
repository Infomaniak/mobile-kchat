import React, { Component } from 'react';
import { IProps } from '../../types';
/**
 * Implements a component to render a display name prompt.
 */
declare class DisplayNamePrompt extends Component<IProps> {
    _onSetDisplayName: (displayName: string) => boolean;
    /**
     * Initializes a new {@code DisplayNamePrompt} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof DisplayNamePrompt, import("react-redux").Omit<React.ClassAttributes<DisplayNamePrompt> & IProps, "dispatch">>;
export default _default;
