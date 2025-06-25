/// <reference types="react" />
import { IReduxState } from '../../../app/types';
/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {Props}
 */
export declare function mapStateToProps(state: IReduxState, ownProps: any): {
    visible: any;
    _requestingSubtitles: boolean;
    _language: string | null;
};
declare const _default: import("react").ComponentType<import("react-i18next").Omit<any, keyof import("react-i18next").WithTranslation>>;
export default _default;
