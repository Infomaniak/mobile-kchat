import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link WaitForOwnerDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * Whether to show alternative cancel button text.
     */
    _alternativeCancelText?: boolean;
    /**
     * Whether to hide the login button.
     */
    _hideLoginButton?: boolean;
    /**
     * Redux store dispatch method.
     */
    dispatch: IStore['dispatch'];
}
/**
 * Authentication message dialog for host confirmation.
 *
 * @returns {React$Element<any>}
 */
declare class WaitForOwnerDialog extends PureComponent<IProps> {
    /**
     * Instantiates a new component.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancelWaitForOwner(): void;
    /**
     * Called when the OK button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onIAmHost(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<WaitForOwnerDialog> & IProps, "dispatch" | "_alternativeCancelText" | "_hideLoginButton">, keyof WithTranslation>>;
export default _default;
