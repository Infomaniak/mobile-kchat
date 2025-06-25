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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/web/Label"));
const constants_1 = require("../../../base/label/constants");
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const getUnsafeRoomText_web_1 = __importDefault(require("../../../base/util/getUnsafeRoomText.web"));
const AbstractInsecureRoomNameLabel_1 = __importStar(require("../AbstractInsecureRoomNameLabel"));
/**
 * Renders a label indicating that we are in a room with an insecure name.
 */
class InsecureRoomNameLabel extends AbstractInsecureRoomNameLabel_1.default {
    /**
     * Renders the platform dependent content.
     *
     * @inheritdoc
     */
    _render() {
        return (react_1.default.createElement(Tooltip_1.default, { content: (0, getUnsafeRoomText_web_1.default)(this.props.t, 'meeting'), position: 'bottom' },
            react_1.default.createElement(Label_1.default, { color: constants_1.COLORS.red, icon: svg_1.IconExclamationTriangle })));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractInsecureRoomNameLabel_1._mapStateToProps)(InsecureRoomNameLabel));
