import { ComponentType } from 'react';
import { IReduxState } from '../../app/types';
import { IStateful } from '../app/types';
/**
 * Checks if any {@code Dialog} is currently open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export declare function isAnyDialogOpen(stateful: IStateful): boolean;
/**
 * Checks if a {@code Dialog} with a specific {@code component} is currently
 * open.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @param {React.Component} component - The {@code component} of a
 * {@code Dialog} to be checked.
 * @returns {boolean}
 */
export declare function isDialogOpen(stateful: IStateful, component: ComponentType<any>): boolean;
/**
 * Maps part of the Redux state to the props of any Dialog based component.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {{
 *     _dialogStyles: StyleType
 * }}
 */
export declare function _abstractMapStateToProps(state: IReduxState): {
    _dialogStyles: import("../styles/functions.any").StyleType;
};
