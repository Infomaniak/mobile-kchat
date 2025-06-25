import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * The type of the React {@code Component} props of {@link DialInLink}.
 */
export interface IProps extends WithTranslation {
    /**
     * The redux state representing the dial-in numbers feature.
     */
    _dialIn: Object;
    /**
     * The url of the page containing the dial-in numbers list.
     */
    _dialInfoPageUrl: string;
}
/**
 * React {@code Component} responsible for displaying a telephone number and
 * conference ID for dialing into a conference.
 *
 * @augments Component
 */
declare class DialInLink extends Component<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<DialInLink> & IProps, "_dialIn" | "_dialInfoPageUrl">, keyof WithTranslation>>;
export default _default;
