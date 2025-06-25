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
const ConfirmDialog_1 = __importDefault(require("../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../base/i18n/functions");
const actions_1 = require("../actions");
/**
 * Component for the add Jitsi link confirm dialog.
 */
class UpdateCalendarEventDialog extends react_1.Component {
    /**
     * Initializes a new {@code UpdateCalendarEventDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<ConfirmDialog_1.default descriptionKey='calendarSync.confirmAddLink' onSubmit={this._onSubmit}/>);
    }
    /**
     * Callback for the confirm button.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        this.props.dispatch((0, actions_1.updateCalendarEvent)(this.props.eventId));
        return true;
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(UpdateCalendarEventDialog));
