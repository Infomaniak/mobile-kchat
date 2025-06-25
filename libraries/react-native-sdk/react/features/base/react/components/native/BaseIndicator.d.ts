import { Component } from 'react';
import { StyleType } from '../../../styles/functions.any';
export interface IProps {
    /**
     * Overwritten background color when indicator is highlighted.
     */
    backgroundColor?: string;
    /**
     * True if a highlighted background has to be applied.
     */
    highlight?: boolean;
    /**
     * The name of the icon to be used as the indicator.
     */
    icon: Function;
    /**
     * Additional style to be applied to the icon element.
     */
    iconStyle?: StyleType;
}
/**
 * Implements a base indicator to be reused across all native indicators on
 * the filmstrip.
 */
export default class BaseIndicator extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
