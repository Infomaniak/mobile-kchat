import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { IStore } from '../../../app/types';
import { ILocalParticipant } from '../../../base/participants/types';
/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
export interface IProps {
    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol;
    /**
     * The number of columns.
     */
    _columns: number;
    /**
     * Whether or not to hide the self view.
     */
    _disableSelfView: boolean;
    /**
     * Application's viewport height.
     */
    _height: number;
    /**
     * The local participant.
     */
    _localParticipant?: ILocalParticipant;
    /**
     * The number of participants in the conference.
     */
    _participantCount: number;
    /**
     * An array with the IDs of the remote participants in the conference.
     */
    _remoteParticipants: Array<string>;
    /**
     * The thumbnail height.
     */
    _thumbnailHeight?: number;
    /**
     * Application's viewport height.
     */
    _width: number;
    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: IStore['dispatch'];
    /**
     * Object containing the safe area insets.
     */
    insets: EdgeInsets;
    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: (e?: GestureResponderEvent) => void;
}
declare const _default: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
export default _default;
