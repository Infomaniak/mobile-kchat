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
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const functions_2 = require("../../../breakout-rooms/functions");
const actions_native_1 = require("../../../invite/actions.native");
const functions_3 = require("../../../share-room/functions");
const functions_4 = require("../../functions");
const MeetingParticipantItem_1 = __importDefault(require("./MeetingParticipantItem"));
const styles_1 = __importDefault(require("./styles"));
const MeetingParticipantList = () => {
    const currentRoomId = (0, react_redux_1.useSelector)(functions_2.getCurrentRoomId);
    const currentRoom = (0, react_redux_1.useSelector)(functions_2.getBreakoutRooms)[currentRoomId];
    const dispatch = (0, react_redux_1.useDispatch)();
    const inviteOthersControl = (0, react_redux_1.useSelector)(functions_3.getInviteOthersControl);
    const isAddPeopleFeatureEnabled = (0, react_redux_1.useSelector)(functions_1.addPeopleFeatureControl);
    const keyExtractor = (0, react_1.useCallback)((e, i) => i.toString(), []);
    const localParticipant = (0, react_redux_1.useSelector)(functions_1.getLocalParticipant);
    const onInvite = (0, react_1.useCallback)(() => {
        (0, functions_1.setShareDialogVisiblity)(isAddPeopleFeatureEnabled, dispatch);
        dispatch((0, actions_native_1.doInvitePeople)());
    }, [dispatch]);
    const [searchString, setSearchString] = (0, react_1.useState)('');
    const onSearchStringChange = (0, react_1.useCallback)((text) => setSearchString(text), []);
    const participantsCount = (0, react_redux_1.useSelector)(functions_1.getParticipantCountWithFake);
    const remoteParticipants = (0, react_redux_1.useSelector)(functions_1.getRemoteParticipants);
    const renderParticipant = ({ item /* , index, separators */ }) => {
        const participant = item === localParticipant?.id
            ? localParticipant : remoteParticipants.get(item);
        if ((0, functions_4.participantMatchesSearch)(participant, searchString)) {
            return (<MeetingParticipantItem_1.default key={item} participant={participant}/>);
        }
        return null;
    };
    const showInviteButton = (0, react_redux_1.useSelector)(functions_4.shouldRenderInviteButton);
    const sortedRemoteParticipants = (0, react_redux_1.useSelector)((state) => state['features/filmstrip'].remoteParticipants);
    const { t } = (0, react_i18next_1.useTranslation)();
    const title = currentRoom?.name
        ? `${currentRoom.name} (${participantsCount})`
        : t('participantsPane.headings.participantsList', { count: participantsCount });
    const { color, shareDialogVisible } = inviteOthersControl;
    return (<react_native_1.View style={styles_1.default.meetingListContainer}>
            <react_native_1.Text style={styles_1.default.meetingListDescription}>
                {title}
            </react_native_1.Text>
            {showInviteButton
            && <Button_1.default accessibilityLabel='participantsPane.actions.invite' disabled={shareDialogVisible} 
            // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
            icon={() => (<Icon_1.default color={color} size={20} src={svg_1.IconAddUser}/>)} labelKey='participantsPane.actions.invite' onClick={onInvite} style={styles_1.default.inviteButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>}
            <Input_1.default clearable={true} customStyles={{
            container: styles_1.default.inputContainer,
            input: styles_1.default.centerInput
        }} onChange={onSearchStringChange} placeholder={t('participantsPane.search')} value={searchString}/>
            <react_native_1.FlatList data={[localParticipant?.id, ...sortedRemoteParticipants]} keyExtractor={keyExtractor} 
    /* eslint-disable react/jsx-no-bind */
    renderItem={renderParticipant} windowSize={2}/>
        </react_native_1.View>);
};
exports.default = MeetingParticipantList;
