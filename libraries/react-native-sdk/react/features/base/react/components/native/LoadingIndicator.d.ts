import { PureComponent } from 'react';
export interface IProps {
    /**
     * The color of the spinner.
     */
    color?: string;
    /**
     * Prop to set the size of the indicator. This is the same as the
     * prop of the native component.
     */
    size?: 'large' | 'small' | 'medium';
    style?: any;
}
/**
 * An animated, large react-native {@link ActivityIndicator} which is considered
 * a suitable visualization of long-running processes with indeterminate amounts
 * of work to be done.
 */
export default class LoadingIndicator extends PureComponent<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
