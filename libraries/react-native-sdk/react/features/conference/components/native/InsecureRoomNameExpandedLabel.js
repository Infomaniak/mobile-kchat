"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const ExpandedLabel_1 = __importDefault(require("../../../base/label/components/native/ExpandedLabel"));
const getUnsafeRoomText_native_1 = __importDefault(require("../../../base/util/getUnsafeRoomText.native"));
const styles_1 = require("./styles");
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code InsecureRoomNameExpandedLabel}.
 */
class InsecureRoomNameExpandedLabel extends ExpandedLabel_1.default {
    /**
     * Returns the color this expanded label should be rendered with.
     *
     * @returns {string}
     */
    _getColor() {
        return styles_1.INSECURE_ROOM_NAME_LABEL_COLOR;
    }
    /**
     * Returns the label specific text of this {@code ExpandedLabel}.
     *
     * @returns {string}
     */
    _getLabel() {
        return this.props.getUnsafeRoomTextFn(this.props.t);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        getUnsafeRoomTextFn: (t) => (0, getUnsafeRoomText_native_1.default)(state, t, 'meeting')
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(InsecureRoomNameExpandedLabel));
