"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const styles_1 = __importDefault(require("./styles"));
const ParticipantsCounter = () => {
    const participantsCount = (0, react_redux_1.useSelector)(functions_1.getParticipantCount);
    return <react_native_1.Text style={styles_1.default.participantsBadge}>{participantsCount}</react_native_1.Text>;
};
exports.default = ParticipantsCounter;
