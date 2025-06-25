"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MeetingParticipantItem_1 = __importDefault(require("./MeetingParticipantItem"));
/**
 * Component used to display a list of meeting participants.
 *
 * @returns {ReactNode}
 */
function MeetingParticipantItems({ isInBreakoutRoom, lowerMenu, toggleMenu, muteAudio, participantIds, openDrawerForParticipant, overflowDrawer, raiseContextId, participantActionEllipsisLabel, searchString, stopVideo, youText }) {
    const renderParticipant = (id) => (react_1.default.createElement(MeetingParticipantItem_1.default, { isHighlighted: raiseContextId === id, isInBreakoutRoom: isInBreakoutRoom, key: id, muteAudio: muteAudio, onContextMenu: toggleMenu(id), onLeave: lowerMenu, openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participantActionEllipsisLabel: participantActionEllipsisLabel, participantID: id, searchString: searchString, stopVideo: stopVideo, youText: youText }));
    return (react_1.default.createElement(react_1.default.Fragment, null, participantIds.map(renderParticipant)));
}
// Memoize the component in order to avoid rerender on drawer open/close.
exports.default = react_1.default.memo(MeetingParticipantItems);
