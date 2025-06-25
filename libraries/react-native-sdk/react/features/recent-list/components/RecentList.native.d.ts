import React from 'react';
import { WithTranslation } from 'react-i18next';
import { GestureResponderEvent } from 'react-native';
import { IReduxState, IStore } from '../../app/types';
import { Item, Section } from '../../base/react/types';
import AbstractRecentList from './AbstractRecentList';
/**
 * The type of the React {@code Component} props of {@link RecentList}.
 */
export interface IProps extends WithTranslation {
    /**
     * The default server URL.
     */
    _defaultServerURL: string;
    /**
     * The recent list from the Redux store.
     */
    _recentList: Array<Section>;
    /**
     * Renders the list disabled.
     */
    disabled: boolean;
    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Callback to be invoked when pressing the list container.
     */
    onListContainerPress?: (e?: GestureResponderEvent) => void;
}
/**
 * A class that renders the list of the recently joined rooms.
 *
 */
declare class RecentList extends AbstractRecentList<IProps> {
    /**
     * Initializes a new {@code RecentList} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements the React Components's render method.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {Object} item - The item which was long pressed.
     * @returns {void}
     */
    _onLongPress(item: Item): void;
}
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _defaultServerURL: string;
    _recentList: import("../reducer").IRecentListState;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<import("react-redux").Matching<{
    _defaultServerURL: string;
    _recentList: import("../reducer").IRecentListState;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<RecentList> & IProps>, "dispatch" | "_defaultServerURL" | "_recentList"> | import("react-redux").Omit<React.ClassAttributes<React.Component<import("react-redux").Matching<{
    _defaultServerURL: string;
    _recentList: import("../reducer").IRecentListState;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<RecentList> & IProps>, any, any>> & import("react-redux").Matching<{
    _defaultServerURL: string;
    _recentList: import("../reducer").IRecentListState;
} & import("react-redux").DispatchProp<import("redux").AnyAction>, React.ClassAttributes<RecentList> & IProps>, "dispatch" | "_defaultServerURL" | "_recentList">, keyof WithTranslation>>;
export default _default;
