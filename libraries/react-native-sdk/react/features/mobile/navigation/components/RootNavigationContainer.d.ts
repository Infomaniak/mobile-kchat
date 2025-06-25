/// <reference types="react" />
import { IStore } from '../../../app/types';
export interface IProps {
    /**
     * Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
    * Is unsafe room warning available?
    */
    isUnsafeRoomWarningAvailable: boolean;
    /**
    * Is welcome page available?
    */
    isWelcomePageAvailable: boolean;
}
declare const _default: import("react-redux").ConnectedComponent<({ dispatch, isUnsafeRoomWarningAvailable, isWelcomePageAvailable }: IProps) => JSX.Element, import("react-redux").Omit<IProps, "dispatch" | "isUnsafeRoomWarningAvailable" | "isWelcomePageAvailable">>;
export default _default;
