/// <reference types="react" />
import AbstractContainer, { IProps } from '../AbstractContainer';
/**
 * Represents a container of React/Web {@link Component} children with a style.
 *
 * @augments AbstractContainer
 */
export default class Container<P extends IProps> extends AbstractContainer<P> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | null;
}
