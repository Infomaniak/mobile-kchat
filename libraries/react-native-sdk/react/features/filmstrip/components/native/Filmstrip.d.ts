import React, { PureComponent } from 'react';
import { ViewToken } from 'react-native';
import { IStore } from '../../../app/types';
/**
 * Filmstrip component's property types.
 */
export interface IProps {
    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol;
    _clientHeight: number;
    _clientWidth: number;
    /**
     * Whether or not to hide the self view.
     */
    _disableSelfView: boolean;
    _localParticipantId: string;
    /**
     * The participants in the conference.
     */
    _participants: Array<any>;
    /**
     * Whether or not the toolbox is displayed.
     */
    _toolboxVisible: Boolean;
    /**
     * The indicator which determines whether the filmstrip is visible.
     */
    _visible: boolean;
    /**
     * Invoked to trigger state changes in Redux.
     */
    dispatch: IStore['dispatch'];
    /**
     * Object containing the safe area insets.
     */
    insets?: Object;
}
/**
 * Implements a React {@link Component} which represents the filmstrip on
 * mobile/React Native.
 *
 * @augments Component
 */
declare class Filmstrip extends PureComponent<IProps> {
    /**
     * Whether the local participant should be rendered separately from the
     * remote participants i.e. outside of their {@link ScrollView}.
     */
    _separateLocalThumbnail: boolean;
    /**
     * The FlatList's viewabilityConfig.
     */
    _viewabilityConfig: Object;
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Returns a key for a passed item of the list.
     *
     * @param {string} item - The user ID.
     * @returns {string} - The user ID.
     */
    _keyExtractor(item: string): string;
    /**
     * Calculates the width and height of the filmstrip based on the screen size and aspect ratio.
     *
     * @returns {Object} - The width and the height.
     */
    _getDimensions(): {
        height: number;
        width: number;
    };
    /**
     * Optimization for FlatList. Returns the length, offset and index for an item.
     *
     * @param {Array<string>} _data - The data array with user IDs.
     * @param {number} index - The index number of the item.
     * @returns {Object}
     */
    _getItemLayout(_data: string[] | null | undefined, index: number): {
        length: number;
        offset: number;
        index: number;
    };
    /**
     * A handler for visible items changes.
     *
     * @param {Object} data - The visible items data.
     * @param {Array<Object>} data.viewableItems - The visible items array.
     * @returns {void}
     */
    _onViewableItemsChanged({ viewableItems }: {
        viewableItems: ViewToken[];
    }): void;
    /**
     * Creates React Element to display each participant in a thumbnail.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderThumbnail({ item }: {
        item: string;
    }): JSX.Element;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element | null;
}
declare const _default: React.ForwardRefExoticComponent<Pick<import("react-redux").Omit<React.ClassAttributes<Filmstrip> & IProps, "dispatch" | "_aspectRatio" | "_disableSelfView" | "_visible" | "_clientHeight" | "_clientWidth" | "_localParticipantId" | "_participants" | "_toolboxVisible">, "key" | "insets"> & React.RefAttributes<unknown>>;
export default _default;
