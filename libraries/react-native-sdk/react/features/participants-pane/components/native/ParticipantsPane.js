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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const functions_1 = require("../../../base/participants/functions");
const LobbyParticipantList_1 = __importDefault(require("./LobbyParticipantList"));
const MeetingParticipantList_1 = __importDefault(require("./MeetingParticipantList"));
const ParticipantsPaneFooter_1 = __importDefault(require("./ParticipantsPaneFooter"));
const VisitorsList_1 = __importDefault(require("./VisitorsList"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Participants pane.
 *
 * @returns {React$Element<any>}
 */
const ParticipantsPane = () => {
    const isLocalModerator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const keyExtractor = (0, react_1.useCallback)((e, i) => i.toString(), []);
    return (<JitsiScreen_1.default footerComponent={isLocalModerator ? ParticipantsPaneFooter_1.default : undefined} style={styles_1.default.participantsPaneContainer}>

            {/* Fixes warning regarding nested lists */}
            <react_native_1.FlatList 
    // eslint-disable-next-line react/jsx-no-bind
    ListHeaderComponent={() => (<>
                        <VisitorsList_1.default />
                        <LobbyParticipantList_1.default />
                        <MeetingParticipantList_1.default />
                    </>)} data={[]} keyExtractor={keyExtractor} renderItem={null} windowSize={2}/>
        </JitsiScreen_1.default>);
};
exports.default = ParticipantsPane;
