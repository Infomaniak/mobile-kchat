import React, { PureComponent } from 'react';
import { WithTranslation } from 'react-i18next';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link FlipLocalVideoButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * The current local flip x status.
     */
    _localFlipX: boolean;
    /**
     * Button text class name.
     */
    className: string;
    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Callback to execute when the button is clicked.
     */
    notifyClick?: Function;
    /**
     * Notify mode for `participantMenuButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function;
}
/**
 * Implements a React {@link Component} which displays a button for flipping the local viedo.
 *
 * @augments Component
 */
declare class FlipLocalVideoButton extends PureComponent<IProps> {
    /**
     * Initializes a new {@code FlipLocalVideoButton} instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {null|ReactElement}
     */
    render(): JSX.Element;
    /**
     * Flips the local video.
     *
     * @private
     * @returns {void}
     */
    _onClick(): void;
}
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<FlipLocalVideoButton> & IProps, "dispatch" | "_localFlipX">, keyof WithTranslation>>;
export default _default;
