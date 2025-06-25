import { Component } from 'react';
import { StyleType } from '../../../styles/functions.native';
import { IAvatarProps } from '../../types';
export interface IProps extends IAvatarProps {
    /**
     * One of the expected status strings (e.g. 'available') to render a badge on the avatar, if necessary.
     */
    status?: string;
    /**
     * External style passed to the component.
     */
    style?: StyleType;
    /**
     * The URL of the avatar to render.
     */
    url?: string;
}
/**
 * Implements a stateless avatar component that renders an avatar purely from what gets passed through
 * props.
 */
export default class StatelessAvatar extends Component<IProps> {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
    /**
     * Renders a badge representing the avatar status.
     *
     * @returns {React$Elementaa}
     */
    _renderAvatarStatus(): JSX.Element | null;
    /**
     * Renders the default avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderDefaultAvatar(): JSX.Element;
    /**
     * Renders the icon avatar.
     *
     * @param {Object} icon - The icon component to render.
     * @returns {React$Element<*>}
     */
    _renderIconAvatar(icon: Function): JSX.Element;
    /**
     * Renders the initials-based avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderInitialsAvatar(): JSX.Element;
    /**
     * Renders the url-based avatar.
     *
     * @returns {React$Element<*>}
     */
    _renderURLAvatar(): JSX.Element;
    /**
     * Handles avatar load errors.
     *
     * @returns {void}
     */
    _onAvatarLoadError(): void;
}
