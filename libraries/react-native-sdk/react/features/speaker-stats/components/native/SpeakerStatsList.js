"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const AbstractSpeakerStatsList_1 = __importDefault(require("../AbstractSpeakerStatsList"));
const SpeakerStatsItem_1 = __importDefault(require("./SpeakerStatsItem"));
/**
 * Component that renders the list of speaker stats.
 *
 * @returns {React$Element<any>}
 */
const SpeakerStatsList = () => {
    const items = (0, AbstractSpeakerStatsList_1.default)(SpeakerStatsItem_1.default);
    return (<react_native_1.View>
            {items}
        </react_native_1.View>);
};
exports.default = SpeakerStatsList;
