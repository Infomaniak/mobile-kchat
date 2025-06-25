"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/dialog/actions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const _1 = require("./");
/**
 * An abstract remote video menu button which disables the camera of all the other participants.
 */
class AbstractMuteEveryoneElsesVideoButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.muteEveryoneElsesVideoStream';
        this.icon = svg_1.IconVideoOff;
        this.label = 'videothumbnail.domuteVideoOfOthers';
    }
    /**
     * Handles clicking / pressing the button, and opens a confirmation dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('mute.everyoneelsesvideo.pressed'));
        dispatch((0, actions_1.openDialog)(_1.MuteEveryonesVideoDialog, { exclude: [participantID] }));
    }
}
exports.default = AbstractMuteEveryoneElsesVideoButton;
