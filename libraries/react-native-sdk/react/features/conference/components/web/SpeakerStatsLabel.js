"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/web/Label"));
const constants_1 = require("../../../base/label/constants");
const functions_1 = require("../../../base/participants/functions");
const SpeakerStats_1 = __importDefault(require("../../../speaker-stats/components/web/SpeakerStats"));
const functions_2 = require("../../../speaker-stats/functions");
const functions_3 = require("../../../visitors/functions");
/**
 * ParticipantsCount react component.
 * Displays the number of participants and opens Speaker stats on click.
 *
 * @class ParticipantsCount
 */
function SpeakerStatsLabel() {
    const conference = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference);
    let count = (0, react_redux_1.useSelector)(functions_1.getParticipantCount);
    const iAmVisitorState = (0, react_redux_1.useSelector)(functions_3.iAmVisitor);
    const _isSpeakerStatsDisabled = (0, react_redux_1.useSelector)(functions_2.isSpeakerStatsDisabled);
    const dispatch = (0, react_redux_1.useDispatch)();
    // visitor has hidden its own video and should not count itself
    if (iAmVisitorState) {
        count--;
    }
    const onClick = () => {
        dispatch((0, actions_1.openDialog)(SpeakerStats_1.default, { conference }));
    };
    if (count <= 2 || _isSpeakerStatsDisabled) {
        return null;
    }
    return (react_1.default.createElement(Label_1.default, { color: constants_1.COLORS.white, icon: svg_1.IconUsers, iconColor: '#fff', 
        // eslint-disable-next-line react/jsx-no-bind
        onClick: onClick, text: `${count}` }));
}
exports.default = SpeakerStatsLabel;
