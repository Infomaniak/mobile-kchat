"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-multi-comp */
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const E2EELabel_1 = __importDefault(require("../../../e2ee/components/E2EELabel"));
const HighlightButton_1 = __importDefault(require("../../../recording/components/Recording/web/HighlightButton"));
const RecordingLabel_1 = __importDefault(require("../../../recording/components/web/RecordingLabel"));
const actions_web_1 = require("../../../toolbox/actions.web");
const functions_web_1 = require("../../../toolbox/functions.web");
const VideoQualityLabel_web_1 = __importDefault(require("../../../video-quality/components/VideoQualityLabel.web"));
const VisitorsCountLabel_1 = __importDefault(require("../../../visitors/components/web/VisitorsCountLabel"));
const ConferenceTimer_1 = __importDefault(require("../ConferenceTimer"));
const functions_web_2 = require("../functions.web");
const ConferenceInfoContainer_1 = __importDefault(require("./ConferenceInfoContainer"));
const InsecureRoomNameLabel_1 = __importDefault(require("./InsecureRoomNameLabel"));
const RaisedHandsCountLabel_1 = __importDefault(require("./RaisedHandsCountLabel"));
const SpeakerStatsLabel_1 = __importDefault(require("./SpeakerStatsLabel"));
const SubjectText_1 = __importDefault(require("./SubjectText"));
const ToggleTopPanelLabel_1 = __importDefault(require("./ToggleTopPanelLabel"));
const COMPONENTS = [
    {
        Component: HighlightButton_1.default,
        id: 'highlight-moment'
    },
    {
        Component: SubjectText_1.default,
        id: 'subject'
    },
    {
        Component: ConferenceTimer_1.default,
        id: 'conference-timer'
    },
    {
        Component: SpeakerStatsLabel_1.default,
        id: 'participants-count'
    },
    {
        Component: E2EELabel_1.default,
        id: 'e2ee'
    },
    {
        Component: () => (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(RecordingLabel_1.default, { mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE }),
            react_1.default.createElement(RecordingLabel_1.default, { mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM }))),
        id: 'recording'
    },
    {
        Component: RaisedHandsCountLabel_1.default,
        id: 'raised-hands-count'
    },
    {
        Component: VideoQualityLabel_web_1.default,
        id: 'video-quality'
    },
    {
        Component: VisitorsCountLabel_1.default,
        id: 'visitors-count'
    },
    {
        Component: InsecureRoomNameLabel_1.default,
        id: 'insecure-room'
    },
    {
        Component: ToggleTopPanelLabel_1.default,
        id: 'top-panel-toggle'
    }
];
/**
 * The upper band of the meeing containing the conference name, timer and labels.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$None}
 */
class ConferenceInfo extends react_1.Component {
    /**
     * Initializes a new {@code ConferenceInfo} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._renderAutoHide = this._renderAutoHide.bind(this);
        this._renderAlwaysVisible = this._renderAlwaysVisible.bind(this);
        this._onTabIn = this._onTabIn.bind(this);
    }
    /**
     * Callback invoked when the component is focused to show the conference
     * info if necessary.
     *
     * @returns {void}
     */
    _onTabIn() {
        if (this.props._conferenceInfo.autoHide?.length && !this.props._visible) {
            this.props.dispatch((0, actions_web_1.showToolbox)());
        }
    }
    /**
     * Renders auto-hidden info header labels.
     *
     * @returns {void}
     */
    _renderAutoHide() {
        const { autoHide } = this.props._conferenceInfo;
        if (!autoHide?.length) {
            return null;
        }
        return (react_1.default.createElement(ConferenceInfoContainer_1.default, { id: 'autoHide', visible: this.props._visible }, COMPONENTS
            .filter(comp => autoHide.includes(comp.id))
            .map(c => react_1.default.createElement(c.Component, { key: c.id }))));
    }
    /**
     * Renders the always visible info header labels.
     *
     * @returns {void}
     */
    _renderAlwaysVisible() {
        const { alwaysVisible } = this.props._conferenceInfo;
        if (!alwaysVisible?.length) {
            return null;
        }
        return (react_1.default.createElement(ConferenceInfoContainer_1.default, { id: 'alwaysVisible', visible: true }, COMPONENTS
            .filter(comp => alwaysVisible.includes(comp.id))
            .map(c => react_1.default.createElement(c.Component, { key: c.id }))));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement("div", { className: 'details-container', onFocus: this._onTabIn },
            this._renderAlwaysVisible(),
            this._renderAutoHide()));
    }
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _visible: boolean,
 *     _conferenceInfo: Object
 * }}
 */
function _mapStateToProps(state) {
    return {
        _visible: (0, functions_web_1.isToolboxVisible)(state),
        _conferenceInfo: (0, functions_web_2.getConferenceInfo)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(ConferenceInfo);
