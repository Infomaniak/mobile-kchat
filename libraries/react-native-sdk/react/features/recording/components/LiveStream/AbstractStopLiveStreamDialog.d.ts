import { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IReduxState } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
import { ISessionData } from '../../reducer';
/**
 * The type of the React {@code Component} props of
 * {@link StopLiveStreamDialog}.
 */
export interface IProps extends WithTranslation {
    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference?: IJitsiConference;
    /**
     * The redux representation of the live streaming to be stopped.
     */
    _session?: ISessionData;
}
/**
 * A React Component for confirming the participant wishes to stop the currently
 * active live stream of the conference.
 *
 * @augments Component
 */
export default class AbstractStopLiveStreamDialog extends Component<IProps> {
    /**
     * Initializes a new {@code StopLiveStreamDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Callback invoked when stopping of live streaming is confirmed.
     *
     * @private
     * @returns {boolean} True to close the modal.
     */
    _onSubmit(): boolean;
}
/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code StopLiveStreamDialog}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _conference: Object,
 *     _session: Object
 * }}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _conference: IJitsiConference | undefined;
    _session: ISessionData | undefined;
};
