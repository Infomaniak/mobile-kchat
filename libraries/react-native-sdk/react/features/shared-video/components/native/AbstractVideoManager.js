"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const throttle_1 = __importDefault(require("lodash/throttle"));
const react_1 = require("react");
const functions_1 = require("../../../base/conference/functions");
const functions_2 = require("../../../base/participants/functions");
const actions_any_1 = require("../../actions.any");
const constants_1 = require("../../constants");
/**
 * Return true if the difference between the two times is larger than 5.
 *
 * @param {number} newTime - The current time.
 * @param {number} previousTime - The previous time.
 * @private
 * @returns {boolean}
*/
function shouldSeekToPosition(newTime, previousTime) {
    return Math.abs(newTime - previousTime) > 5;
}
/**
 * Manager of shared video.
 */
class AbstractVideoManager extends react_1.PureComponent {
    /**
     * Initializes a new instance of AbstractVideoManager.
     *
     * @param {IProps} props - Component props.
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.throttledFireUpdateSharedVideoEvent = (0, throttle_1.default)(this.fireUpdateSharedVideoEvent.bind(this), 5000);
    }
    /**
     * Implements React Component's componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.processUpdatedProps();
    }
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this.processUpdatedProps();
    }
    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        if (this.dispose) {
            this.dispose();
        }
    }
    /**
     * Processes new properties.
     *
     * @returns {void}
     */
    async processUpdatedProps() {
        const { _status, _time, _isOwner } = this.props;
        if (_isOwner) {
            return;
        }
        const playerTime = await this.getTime();
        if (shouldSeekToPosition(_time, playerTime)) {
            this.seek(_time);
        }
        if (this.getPlaybackStatus() !== _status) {
            if (_status === constants_1.PLAYBACK_STATUSES.PLAYING) {
                this.play();
            }
            else if (_status === constants_1.PLAYBACK_STATUSES.PAUSED) {
                this.pause();
            }
        }
    }
    /**
     * Handle video playing.
     *
     * @returns {void}
     */
    onPlay() {
        this.fireUpdateSharedVideoEvent();
    }
    /**
     * Handle video paused.
     *
     * @returns {void}
     */
    onPause() {
        this.fireUpdateSharedVideoEvent();
    }
    /**
     * Dispatches an update action for the shared video.
     *
     * @returns {void}
     */
    async fireUpdateSharedVideoEvent() {
        const { _isOwner } = this.props;
        if (!_isOwner) {
            return;
        }
        const status = this.getPlaybackStatus();
        if (!Object.values(constants_1.PLAYBACK_STATUSES).includes(status)) {
            return;
        }
        const time = await this.getTime();
        const { _ownerId, _videoUrl, dispatch } = this.props;
        dispatch((0, actions_any_1.setSharedVideoStatus)({
            videoUrl: _videoUrl ?? '',
            status,
            time,
            ownerId: _ownerId
        }));
    }
    /**
     * Disposes current video player.
     *
     * @returns {void}
     */
    dispose() {
        // optional abstract method to be implemented by sub-class
    }
}
exports.default = AbstractVideoManager;
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { ownerId, status, time, videoUrl } = state['features/shared-video'];
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    return {
        _conference: (0, functions_1.getCurrentConference)(state),
        _isOwner: ownerId === localParticipant?.id,
        _ownerId: ownerId,
        _status: status,
        _time: Number(time),
        _videoUrl: videoUrl
    };
}
exports._mapStateToProps = _mapStateToProps;
