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
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractMapStateToProps = exports.AbstractConference = void 0;
const react_1 = __importStar(require("react"));
const components_1 = require("../../notifications/components");
const functions_any_1 = require("../../video-layout/functions.any");
const functions_1 = require("../functions");
/**
 * A container to hold video status labels, including recording status and
 * current large video quality.
 *
 * @augments Component
 */
class AbstractConference extends react_1.Component {
    /**
     * Renders the {@code LocalRecordingLabel}.
     *
     * @param {Object} props - The properties to be passed to
     * the {@code NotificationsContainer}.
     * @protected
     * @returns {React$Element}
     */
    renderNotificationsContainer(props) {
        if (this.props._notificationsVisible) {
            return (react_1.default.createElement(components_1.NotificationsContainer, props));
        }
        return null;
    }
}
exports.AbstractConference = AbstractConference;
/**
 * Maps (parts of) the redux state to the associated props of the {@link Labels}
 * {@code Component}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {AbstractProps}
 */
function abstractMapStateToProps(state) {
    return {
        _notificationsVisible: (0, functions_1.shouldDisplayNotifications)(state),
        _room: state['features/base/conference'].room ?? '',
        _shouldDisplayTileView: (0, functions_any_1.shouldDisplayTileView)(state)
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
