"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
/**
 * Implements an abstract class for the StartLiveStreamDialog on both platforms.
 *
 * NOTE: Google log-in is not supported for mobile yet for later implementation
 * but the abstraction of its properties are already present in this abstract
 * class.
 */
class AbstractStartLiveStreamDialog extends react_1.Component {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            broadcasts: undefined,
            errorType: undefined,
            selectedBoundStreamID: undefined,
            streamKey: ''
        };
        /**
         * Instance variable used to flag whether the component is or is not
         * mounted. Used as a hack to avoid setting state on an unmounted
         * component.
         *
         * @private
         * @type {boolean}
         */
        this._isMounted = false;
        this._onCancel = this._onCancel.bind(this);
        this._onStreamKeyChange = this._onStreamKeyChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        this._isMounted = true;
    }
    /**
     * Implements React's {@link Component#componentWillUnmount()}. Invoked
     * immediately before this component is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._isMounted = false;
    }
    /**
     * Invokes the passed in {@link onCancel} callback and closes
     * {@code StartLiveStreamDialog}.
     *
     * @private
     * @returns {boolean} True is returned to close the modal.
     */
    _onCancel() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createLiveStreamingDialogEvent)('start', 'cancel.button'));
        return true;
    }
    /**
     * Asks the user to sign in, if not already signed in, and then requests a
     * list of the user's YouTube broadcasts.
     *
     * NOTE: To be implemented by platforms.
     *
     * @private
     * @returns {Promise}
     */
    _onGetYouTubeBroadcasts() {
        // to be overwritten by child classes.
    }
    /**
     * Callback invoked to update the {@code StartLiveStreamDialog} component's
     * display of the entered YouTube stream key.
     *
     * @param {string} streamKey - The stream key entered in the field.
     * @private
     * @returns {void}
     */
    _onStreamKeyChange(streamKey) {
        this._setStateIfMounted({
            streamKey,
            selectedBoundStreamID: undefined
        });
    }
    /**
     * Invokes the passed in {@link onSubmit} callback with the entered stream
     * key, and then closes {@code StartLiveStreamDialog}.
     *
     * @private
     * @returns {boolean} False if no stream key is entered to preventing
     * closing, true to close the modal.
     */
    _onSubmit() {
        const { broadcasts, selectedBoundStreamID } = this.state;
        const key = (this.state.streamKey || this.props._streamKey || '').trim();
        if (!key) {
            return false;
        }
        let selectedBroadcastID = null;
        if (selectedBoundStreamID) {
            const selectedBroadcast = broadcasts?.find(broadcast => broadcast.boundStreamID === selectedBoundStreamID);
            selectedBroadcastID = selectedBroadcast?.id;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createLiveStreamingDialogEvent)('start', 'confirm.button'));
        this.props._conference?.startRecording({
            broadcastId: selectedBroadcastID,
            mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM,
            streamId: key
        });
        return true;
    }
    /**
     * Updates the internal state if the component is still mounted. This is a
     * workaround for all the state setting that occurs after ajax.
     *
     * @param {Object} newState - The new state to merge into the existing
     * state.
     * @private
     * @returns {void}
     */
    _setStateIfMounted(newState) {
        if (this._isMounted) {
            this.setState(newState);
        }
    }
}
exports.default = AbstractStartLiveStreamDialog;
/**
 * Maps part of the Redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _conference: Object,
 *     _googleAPIState: number,
 *     _googleProfileEmail: string,
 *     _streamKey: string
 * }}
 */
function _mapStateToProps(state) {
    return {
        _conference: state['features/base/conference'].conference,
        _googleAPIState: state['features/google-api'].googleAPIState,
        _googleProfileEmail: state['features/google-api'].profileEmail,
        _streamKey: state['features/recording'].streamKey
    };
}
exports._mapStateToProps = _mapStateToProps;
