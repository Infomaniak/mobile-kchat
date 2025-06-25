import { Component } from 'react';
import { IProps } from '../base/toolbox/components/AbstractButton';
type Props = Partial<IProps>;
/**
 * Stateless hangup button for the Always-on-Top windows.
 */
export default class HangupButton extends Component<Props> {
    accessibilityLabel: string;
    icon: any;
    /**
     * Initializes a new {@code HangupButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code HangupButton} instance with.
     */
    constructor(props: Props);
    /**
     * Handles clicking / pressing the button, and disconnects the conference.
     *
     * @protected
     * @returns {void}
     */
    _onClick(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
export {};
