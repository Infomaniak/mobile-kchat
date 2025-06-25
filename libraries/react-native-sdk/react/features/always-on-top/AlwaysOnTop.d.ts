import { Component } from 'react';
/**
 * The type of the React {@code Component} state of {@link AlwaysOnTop}.
 */
export interface IState {
    avatarURL: string;
    customAvatarBackgrounds: Array<string>;
    displayName: string;
    formattedDisplayName: string;
    isVideoDisplayed: boolean;
    userID: string;
    visible: boolean;
}
/**
 * Represents the always on top page.
 *
 * @class AlwaysOnTop
 * @augments Component
 */
export default class AlwaysOnTop extends Component<any, IState> {
    _hovered: boolean;
    /**
     * Initializes a new {@code AlwaysOnTop} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props: any);
    /**
     * Handles avatar changed api events.
     *
     * @returns {void}
     */
    _avatarChangedListener({ avatarURL, id }: {
        avatarURL: string;
        id: string;
    }): void;
    /**
     * Handles display name changed api events.
     *
     * @returns {void}
     */
    _displayNameChangedListener({ displayname, formattedDisplayName, id }: {
        displayname: string;
        formattedDisplayName: string;
        id: string;
    }): void;
    /**
     * Hides the toolbar after a timeout.
     *
     * @returns {void}
     */
    _hideToolbarAfterTimeout(): void;
    /**
     * Handles large video changed api events.
     *
     * @returns {void}
     */
    _videoChangedListener(): void;
    /**
     * Handles mouse move events.
     *
     * @returns {void}
     */
    _mouseMove(): void;
    /**
     * Toolbar mouse out handler.
     *
     * @returns {void}
     */
    _onMouseOut(): void;
    /**
     * Toolbar mouse over handler.
     *
     * @returns {void}
     */
    _onMouseOver(): void;
    /**
     * Renders display name and avatar for the on stage participant.
     *
     * @returns {ReactElement}
     */
    _renderVideoNotAvailableScreen(): JSX.Element | null;
    /**
     * Sets mouse move listener and initial toolbar timeout.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Sets a timeout to hide the toolbar when the toolbar is shown.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(_prevProps: any, prevState: IState): void;
    /**
     * Removes all listeners.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
