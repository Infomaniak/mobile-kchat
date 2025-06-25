"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const ParticipantsConter_1 = __importDefault(require("./ParticipantsConter"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements an {@link AbstractButton} to open the participants panel.
 */
class ParticipantsPaneButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.participants';
        this.icon = svg_1.IconUsers;
        this.label = 'toolbar.participants';
    }
    /**
     * Handles clicking / pressing the button, and opens the participants panel.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.participants);
    }
    /**
     * Overrides AbstractButton's {@link Component#render()}.
     *
     * @override
     * @protected
     * @returns {React$Node}
     */
    render() {
        return (<react_native_1.View style={styles_1.default.participantsButtonBadge}>
                {super.render()}
                <ParticipantsConter_1.default />
            </react_native_1.View>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(ParticipantsPaneButton));
