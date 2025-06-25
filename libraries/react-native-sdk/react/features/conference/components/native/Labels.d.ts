import { Component } from 'react';
export interface IProps {
    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    createOnPress: Function;
}
/**
 * A container that renders the conference indicators, if any.
 */
declare class Labels extends Component<IProps> {
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
export default Labels;
