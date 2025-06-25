import React from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState, IStore } from '../../app/types';
import AbstractRecentList from './AbstractRecentList';
/**
 * The type of the React {@code Component} props of {@link RecentList}.
 */
export interface IProps extends WithTranslation {
    /**
     * The recent list from the Redux store.
     */
    _recentList: Array<any>;
    /**
     * Renders the list disabled.
     */
    disabled?: boolean;
    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}
/**
 * The cross platform container rendering the list of the recently joined rooms.
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
     * Deletes a recent entry.
     *
     * @param {Object} entry - The entry to be deleted.
     * @inheritdoc
     */
    _onItemDelete(entry: Object): void;
    /**
     * Implements the React Components's render method.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
}
/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
 *     _defaultServerURL: string,
 *     _recentList: Array
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _recentList: import("../reducer").IRecentListState;
};
declare const _default: React.ComponentType<import("react-i18next").Omit<import("react-redux").Omit<React.ClassAttributes<RecentList> & IProps, "dispatch" | "_recentList">, keyof WithTranslation>>;
export default _default;
