import { ComponentType } from 'react';
import { IStore } from '../../../app/types';
import { StyleType } from '../../../base/styles/functions.native';
/**
 * The type of the React {@code Component} props of {@link ReactionMenuDialog}.
 */
export interface IProps {
    /**
    * The height of the screen.
    */
    _height: number;
    /**
     * True if the dialog is currently visible, false otherwise.
     */
    _isOpen: boolean;
    /**
     * Number of conference participants.
     */
    _participantCount: number;
    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType;
    /**
     * The width of the screen.
     */
    _width: number;
    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The exported React {@code Component}. We need it to execute
 * {@link hideDialog}.
 *
 * XXX It does not break our coding style rule to not utilize globals for state,
 * because it is merely another name for {@code export}'s {@code default}.
 */
declare let ReactionMenu_: ComponentType<any>;
export default ReactionMenu_;
