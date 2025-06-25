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
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const constants_1 = require("../../../base/media/constants");
const functions_1 = require("../../../base/participants/functions");
const index_1 = require("../../../base/react/components/index");
const functions_any_1 = require("../../../base/tracks/functions.any");
const PresenceLabel_1 = __importDefault(require("../../../presence-status/components/PresenceLabel"));
const constants_2 = require("../../../presence-status/constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React {@link Component} which depicts the establishment of a
 * call with a specific remote callee.
 *
 * @augments Component
 */
class CalleeInfo extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { id, name, status = constants_2.CALLING } = this.props._callee ?? {};
        const className = this.props._isVideoMuted ? 'solidBG' : '';
        return (react_1.default.createElement(index_1.Container, { ...this._style('ringing', className), id: 'ringOverlay' },
            react_1.default.createElement(index_1.Container, { ...this._style('ringing__content') },
                react_1.default.createElement(Avatar_1.default, { ...this._style('ringing__avatar'), participantId: id }),
                react_1.default.createElement(index_1.Container, { ...this._style('ringing__status') },
                    react_1.default.createElement(PresenceLabel_1.default, { defaultPresence: status, ...this._style('ringing__text') })),
                react_1.default.createElement(index_1.Container, { ...this._style('ringing__name') },
                    react_1.default.createElement(index_1.Text, { ...this._style('ringing__text') }, name)))));
    }
    /**
     * Attempts to convert specified CSS class names into React
     * {@link Component} props {@code style} or {@code className}.
     *
     * @param {Array<string>} classNames - The CSS class names to convert
     * into React {@code Component} props {@code style} or {@code className}.
     * @returns {{
     *     className: string,
     *     style: Object
     * }}
     */
    _style(...classNames) {
        let className = '';
        let style = {};
        for (const aClassName of classNames) {
            if (aClassName) {
                // Attempt to convert aClassName into style.
                if (styles_1.default && aClassName in styles_1.default) {
                    // React Native will accept an Array as the value of the
                    // style prop. However, I do not know about React.
                    style = {
                        ...style,
                        ...styles_1.default[aClassName]
                    };
                }
                else {
                    // Otherwise, leave it as className.
                    className += `${aClassName} `;
                }
            }
        }
        // Choose which of the className and/or style props has a value and,
        // consequently, must be returned.
        const props = {
            className: '',
            style: {}
        };
        if (className) {
            props.className = className.trim();
        }
        if (style) {
            props.style = style;
        }
        return props;
    }
}
/**
 * Maps (parts of) the redux state to {@code CalleeInfo}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _callee: Object
 * }}
 */
function _mapStateToProps(state) {
    const _isVideoMuted = (0, functions_any_1.isLocalTrackMuted)(state['features/base/tracks'], constants_1.MEDIA_TYPE.VIDEO);
    // This would be expensive for big calls but the component will be mounted only when there are up
    // to 3 participants in the call.
    for (const [id, p] of (0, functions_1.getRemoteParticipants)(state)) {
        if (p.botType === 'poltergeist') {
            return {
                _callee: {
                    id,
                    name: (0, functions_1.getParticipantDisplayName)(state, id),
                    status: (0, functions_1.getParticipantPresenceStatus)(state, id)
                },
                _isVideoMuted
            };
        }
    }
    return {
        _callee: state['features/invite'].initialCalleeInfo,
        _isVideoMuted
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(CalleeInfo);
