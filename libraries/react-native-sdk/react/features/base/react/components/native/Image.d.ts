import { Component } from 'react';
/**
 * The type of the React {@code Component} props of {@link Image}.
 */
export interface IProps {
    /**
     * The ImageSource to be rendered as image.
     */
    src: Object;
    /**
     * The component's external style.
     */
    style: Object;
}
/**
 * A component rendering aN IMAGE.
 *
 * @augments Component
 */
export default class ImageImpl extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
