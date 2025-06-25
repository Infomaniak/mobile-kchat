"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const Label_1 = __importDefault(require("../../base/label/components/web/Label"));
const constants_1 = require("../../base/label/constants");
const Tooltip_1 = __importDefault(require("../../base/tooltip/components/Tooltip"));
const E2EELabel = ({ _e2eeLabels, _showLabel, t }) => {
    if (!_showLabel) {
        return null;
    }
    const content = _e2eeLabels?.tooltip || t('e2ee.labelToolTip');
    return (react_1.default.createElement(Tooltip_1.default, { content: content, position: 'bottom' },
        react_1.default.createElement(Label_1.default, { color: constants_1.COLORS.green, icon: svg_1.IconE2EE })));
};
/**
 * Maps (parts of) the redux state to the associated props of this {@code Component}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { e2ee = {} } = state['features/base/config'];
    return {
        _e2eeLabels: e2ee.labels,
        _showLabel: state['features/base/participants'].numberOfParticipantsDisabledE2EE === 0
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(E2EELabel));
