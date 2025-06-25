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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const actions_native_1 = require("../../../lobby/actions.native");
const functions_1 = require("../../../lobby/functions");
const styles_1 = __importDefault(require("./styles"));
const ContextMenuLobbyParticipantReject = ({ participant: p }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const knockParticipantsIDArr = (0, react_redux_1.useSelector)(functions_1.getKnockingParticipantsById);
    const knockParticipantIsAvailable = knockParticipantsIDArr.find(knockPartId => knockPartId === p.id);
    const displayName = p.name;
    const reject = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_1.setKnockingParticipantApproval)(p.id, false));
    }, [dispatch]);
    const { t } = (0, react_i18next_1.useTranslation)();
    // eslint-disable-next-line react/no-multi-comp
    const renderMenuHeader = () => (<react_native_1.View style={styles_1.default.contextMenuItemSectionAvatar}>
            <Avatar_1.default participantId={p.id} size={24}/>
            <react_native_paper_1.Text style={styles_1.default.contextMenuItemName}>
                {displayName}
            </react_native_paper_1.Text>
        </react_native_1.View>);
    return (<BottomSheet_1.default addScrollViewPadding={false} 
    /* eslint-disable-next-line react/jsx-no-bind */
    renderHeader={renderMenuHeader} showSlidingView={Boolean(knockParticipantIsAvailable)}>
            <react_native_1.TouchableOpacity onPress={reject} style={styles_1.default.contextMenuItem}>
                <Icon_1.default size={24} src={svg_1.IconCloseLarge}/>
                <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('participantsPane.actions.reject')}</react_native_paper_1.Text>
            </react_native_1.TouchableOpacity>
        </BottomSheet_1.default>);
};
exports.default = ContextMenuLobbyParticipantReject;
