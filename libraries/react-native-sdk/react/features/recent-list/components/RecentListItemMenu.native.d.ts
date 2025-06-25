import React, { PureComponent } from 'react';
import { IStore } from '../../app/types';
import { Item } from '../../base/react/types';
export interface IProps {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Item being rendered in this menu.
     */
    item: Item;
}
/**
 * Class to implement a popup menu that opens upon long pressing a recent list item.
 */
declare class RecentListItemMenu extends PureComponent<IProps> {
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
     * Callback to hide this menu.
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
declare const _default: import("react-redux").ConnectedComponent<typeof RecentListItemMenu, import("react-redux").Omit<React.ClassAttributes<RecentListItemMenu> & IProps, "dispatch">>;
export default _default;
