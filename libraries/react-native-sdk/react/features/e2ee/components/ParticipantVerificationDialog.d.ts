/// <reference types="react" />
import { IReduxState, IStore } from '../../app/types';
import { ISas } from '../reducer';
export interface IProps {
    decimal: string;
    dispatch: IStore['dispatch'];
    emoji: string;
    pId: string;
    participantName?: string;
    sas: ISas;
}
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {IReduxState} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState, ownProps: IProps): {
    sas: ISas;
    pId: string;
    participantName: string | undefined;
};
declare const _default: import("react-redux").ConnectedComponent<({ dispatch, participantName, pId, sas }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "dispatch" | "participantName" | "pId" | "sas"> & IProps>;
export default _default;
