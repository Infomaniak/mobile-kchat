"use strict";
/* eslint-disable lines-around-comment */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const BreakoutRooms_1 = __importDefault(require("../../../../../breakout-rooms/components/native/BreakoutRooms"));
// @ts-ignore
const Chat_1 = __importDefault(require("../../../../../chat/components/native/Chat"));
// @ts-ignore
const Conference_1 = __importDefault(require("../../../../../conference/components/native/Conference"));
// @ts-ignore
const CarMode_1 = __importDefault(require("../../../../../conference/components/native/carmode/CarMode"));
// @ts-ignore
const functions_1 = require("../../../../../conference/functions");
// @ts-ignore
const SharedDocument_1 = __importDefault(require("../../../../../etherpad/components/native/SharedDocument"));
// @ts-ignore
const GifsMenu_1 = __importDefault(require("../../../../../gifs/components/native/GifsMenu"));
const AddPeopleDialog_1 = __importDefault(require("../../../../../invite/components/add-people-dialog/native/AddPeopleDialog"));
// @ts-ignore
const ParticipantsPane_1 = __importDefault(require("../../../../../participants-pane/components/native/ParticipantsPane"));
// @ts-ignore
const StartLiveStreamDialog_1 = __importDefault(require("../../../../../recording/components/LiveStream/native/StartLiveStreamDialog"));
const StartRecordingDialog_1 = __importDefault(require("../../../../../recording/components/Recording/native/StartRecordingDialog"));
const SalesforceLinkDialog_1 = __importDefault(require("../../../../../salesforce/components/native/SalesforceLinkDialog"));
const SecurityDialog_1 = __importDefault(require("../../../../../security/components/security-dialog/native/SecurityDialog"));
const SpeakerStats_1 = __importDefault(require("../../../../../speaker-stats/components/native/SpeakerStats"));
const LanguageSelectorDialog_1 = __importDefault(require("../../../../../subtitles/components/native/LanguageSelectorDialog"));
const Whiteboard_1 = __importDefault(require("../../../../../whiteboard/components/native/Whiteboard"));
// @ts-ignore
const routes_1 = require("../../../routes");
const screenOptions_1 = require("../../../screenOptions");
// @ts-ignore
const ChatAndPollsNavigator_1 = __importDefault(require("../../chat/components/ChatAndPollsNavigator"));
// @ts-ignore
const LobbyNavigationContainer_1 = __importDefault(require("../../lobby/components/LobbyNavigationContainer"));
// @ts-ignore
const SettingsNavigationContainer_1 = __importDefault(require("../../settings/components/SettingsNavigationContainer"));
const ConferenceNavigationContainerRef_1 = require("../ConferenceNavigationContainerRef");
const ConferenceStack = (0, stack_1.createStackNavigator)();
const ConferenceNavigationContainer = () => {
    const isPollsDisabled = (0, react_redux_1.useSelector)(functions_1.arePollsDisabled);
    let ChatScreen;
    let chatScreenName;
    let chatTitleString;
    if (isPollsDisabled) {
        ChatScreen = Chat_1.default;
        chatScreenName = routes_1.screen.conference.chat;
        chatTitleString = 'chat.title';
    }
    else {
        ChatScreen = ChatAndPollsNavigator_1.default;
        chatScreenName = routes_1.screen.conference.chatandpolls.main;
        chatTitleString = 'chat.titleWithPolls';
    }
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<native_1.NavigationContainer independent={true} ref={ConferenceNavigationContainerRef_1.conferenceNavigationRef} theme={screenOptions_1.navigationContainerTheme}>
            <ConferenceStack.Navigator screenOptions={{
            presentation: 'modal'
        }}>
                <ConferenceStack.Screen component={Conference_1.default} name={routes_1.screen.conference.main} options={screenOptions_1.conferenceScreenOptions}/>
                <ConferenceStack.Screen component={ChatScreen} name={chatScreenName} options={{
            ...screenOptions_1.chatScreenOptions,
            title: t(chatTitleString)
        }}/>
                <ConferenceStack.Screen component={ParticipantsPane_1.default} name={routes_1.screen.conference.participants} options={{
            ...screenOptions_1.participantsScreenOptions,
            title: t('participantsPane.title')
        }}/>
                <ConferenceStack.Screen component={SecurityDialog_1.default} name={routes_1.screen.conference.security} options={{
            ...screenOptions_1.securityScreenOptions,
            title: t('security.title')
        }}/>
                <ConferenceStack.Screen component={StartRecordingDialog_1.default} name={routes_1.screen.conference.recording} options={{
            ...screenOptions_1.recordingScreenOptions,
            title: t('recording.title')
        }}/>
                <ConferenceStack.Screen component={StartLiveStreamDialog_1.default} name={routes_1.screen.conference.liveStream} options={{
            ...screenOptions_1.liveStreamScreenOptions,
            title: t('liveStreaming.title')
        }}/>
                <ConferenceStack.Screen component={SpeakerStats_1.default} name={routes_1.screen.conference.speakerStats} options={{
            ...screenOptions_1.speakerStatsScreenOptions,
            title: t('speakerStats.speakerStats')
        }}/>
                <ConferenceStack.Screen component={SalesforceLinkDialog_1.default} name={routes_1.screen.conference.salesforce} options={{
            ...screenOptions_1.salesforceScreenOptions,
            title: t('notify.linkToSalesforce')
        }}/>
                <ConferenceStack.Screen component={GifsMenu_1.default} name={routes_1.screen.conference.gifsMenu} options={{
            ...screenOptions_1.gifsMenuOptions,
            title: t('notify.gifsMenu')
        }}/>
                <ConferenceStack.Screen component={LobbyNavigationContainer_1.default} name={routes_1.screen.lobby.root} options={{
            ...screenOptions_1.lobbyNavigationContainerScreenOptions,
            title: t('lobby.title')
        }}/>
                <ConferenceStack.Screen component={AddPeopleDialog_1.default} name={routes_1.screen.conference.invite} options={{
            ...screenOptions_1.inviteScreenOptions,
            title: t('addPeople.add')
        }}/>
                <ConferenceStack.Screen component={SharedDocument_1.default} name={routes_1.screen.conference.sharedDocument} options={{
            ...screenOptions_1.sharedDocumentScreenOptions,
            title: t('documentSharing.title')
        }}/>
                <ConferenceStack.Screen 
    // @ts-ignore
    component={SettingsNavigationContainer_1.default} name={routes_1.screen.settings.main} options={screenOptions_1.settingsNavigationContainerScreenOptions}/>
                <ConferenceStack.Screen 
    // @ts-ignore
    component={CarMode_1.default} name={routes_1.screen.conference.carmode} options={{
            ...screenOptions_1.carmodeScreenOptions,
            title: t('carmode.labels.title')
        }}/>
                <ConferenceStack.Screen component={LanguageSelectorDialog_1.default} name={routes_1.screen.conference.subtitles} options={{
            ...screenOptions_1.subtitlesScreenOptions,
            title: t('transcribing.subtitles')
        }}/>
                <ConferenceStack.Screen component={BreakoutRooms_1.default} name={routes_1.screen.conference.breakoutRooms} options={{
            ...screenOptions_1.breakoutRoomsScreenOptions,
            title: t('breakoutRooms.title')
        }}/>
                <ConferenceStack.Screen 
    // @ts-ignore
    component={Whiteboard_1.default} name={routes_1.screen.conference.whiteboard} options={{
            ...screenOptions_1.whiteboardScreenOptions,
            title: t('whiteboard.screenTitle')
        }}/>
            </ConferenceStack.Navigator>
        </native_1.NavigationContainer>);
};
exports.default = ConferenceNavigationContainer;
