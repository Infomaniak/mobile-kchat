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
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const actions_native_1 = require("../../../lobby/actions.native");
const functions_1 = require("../../../lobby/functions");
const LobbyParticipantItem_1 = require("./LobbyParticipantItem");
const styles_1 = __importDefault(require("./styles"));
const LobbyParticipantList = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const lobbyEnabled = (0, react_redux_1.useSelector)(functions_1.getLobbyEnabled);
    const participants = (0, react_redux_1.useSelector)(functions_1.getKnockingParticipants);
    const admitAll = (0, react_1.useCallback)(() => dispatch((0, actions_native_1.admitMultiple)(participants)), [dispatch, participants]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const title = t('participantsPane.headings.waitingLobby', { count: participants.length });
    if (!lobbyEnabled || !participants.length) {
        return null;
    }
    return (<>
            <react_native_1.View style={styles_1.default.listDetails}>
                <react_native_1.Text style={styles_1.default.lobbyListDescription}>
                    {title}
                </react_native_1.Text>
                {participants.length > 1 && (<Button_1.default accessibilityLabel='participantsPane.actions.admitAll' labelKey='participantsPane.actions.admitAll' mode={constants_native_1.BUTTON_MODES.TEXT} onClick={admitAll} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>)}
            </react_native_1.View>
            {participants.map(p => (<LobbyParticipantItem_1.LobbyParticipantItem key={p.id} participant={p}/>))}
        </>);
};
exports.default = LobbyParticipantList;
