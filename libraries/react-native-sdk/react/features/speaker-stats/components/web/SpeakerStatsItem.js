"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line lines-around-comment
const react_1 = __importDefault(require("react"));
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const StatelessAvatar_1 = __importDefault(require("../../../base/avatar/components/web/StatelessAvatar"));
const functions_1 = require("../../../base/avatar/functions");
const svg_1 = require("../../../base/icons/svg");
const BaseTheme_web_1 = __importDefault(require("../../../base/ui/components/BaseTheme.web"));
const TimeElapsed_1 = __importDefault(require("./TimeElapsed"));
const Timeline_1 = __importDefault(require("./Timeline"));
const SpeakerStatsItem = (props) => {
    const rowDisplayClass = `row item ${props.hasLeft ? 'has-left' : ''}`;
    const nameTimeClass = `name-time${props.showFaceExpressions ? ' expressions-on' : ''}`;
    const timeClass = `time ${props.isDominantSpeaker ? 'dominant' : ''}`;
    return (react_1.default.createElement("div", { key: props.participantId },
        react_1.default.createElement("div", { className: rowDisplayClass },
            react_1.default.createElement("div", { className: 'avatar' }, props.hasLeft ? (react_1.default.createElement(StatelessAvatar_1.default, { className: 'userAvatar', color: BaseTheme_web_1.default.palette.ui04, iconUser: svg_1.IconUser, initials: (0, functions_1.getInitials)(props.displayName), size: 32 })) : (react_1.default.createElement(Avatar_1.default, { className: 'userAvatar', participantId: props.participantId, size: 32 }))),
            react_1.default.createElement("div", { className: nameTimeClass },
                react_1.default.createElement("div", { "aria-label": props.t('speakerStats.speakerStats'), className: 'display-name' }, props.displayName),
                react_1.default.createElement("div", { "aria-label": props.t('speakerStats.speakerTime'), className: timeClass },
                    react_1.default.createElement(TimeElapsed_1.default, { time: props.dominantSpeakerTime }))),
            props.showFaceExpressions
                && react_1.default.createElement(Timeline_1.default, { faceLandmarks: props.faceLandmarks })),
        react_1.default.createElement("div", { className: 'separator' })));
};
exports.default = SpeakerStatsItem;
