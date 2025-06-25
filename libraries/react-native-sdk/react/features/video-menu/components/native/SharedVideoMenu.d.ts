import { PureComponent } from 'react';
import { IStore } from '../../../app/types';
export interface IProps {
    /**
     * True if the menu is currently open, false otherwise.
     */
    _isOpen: boolean;
    /**
     * Whether the participant is present in the room or not.
     */
    _isParticipantAvailable?: boolean;
    /**
     * Display name of the participant retrieved from Redux.
     */
    _participantDisplayName: string;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * The ID of the participant for which this menu opened for.
     */
    participantId: string;
}
/**
 * Class to implement a popup menu that opens upon long pressing a fake participant thumbnail.
 */
declare class SharedVideoMenu extends PureComponent<IProps> {
    /**
     * Constructor of the component.
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
     * Callback to hide the {@code SharedVideoMenu}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel(): void;
    /**
     * Function to render the menu's header.
     *
     * @returns {React$Element}
     */
    _renderMenuHeader(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof SharedVideoMenu, any>;
export default _default;
