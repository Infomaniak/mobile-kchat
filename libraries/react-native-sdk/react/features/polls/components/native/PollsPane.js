"use strict";
/* eslint-disable react-native/no-color-literals */
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
const native_1 = require("@react-navigation/native");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const TabBarLabelCounter_1 = require("../../../mobile/navigation/components/TabBarLabelCounter");
const AbstractPollsPane_1 = __importDefault(require("../AbstractPollsPane"));
const PollCreate_1 = __importDefault(require("./PollCreate"));
const PollsList_1 = __importDefault(require("./PollsList"));
const styles_1 = require("./styles");
const PollsPane = (props) => {
    const { createMode, onCreate, setCreateMode, t } = props;
    const navigation = (0, native_1.useNavigation)();
    const { isPollsTabFocused } = (0, react_redux_1.useSelector)((state) => state['features/chat']);
    const { nbUnreadPolls } = (0, react_redux_1.useSelector)((state) => state['features/polls']);
    (0, react_1.useEffect)(() => {
        const activeUnreadPollsNr = !isPollsTabFocused && nbUnreadPolls > 0;
        navigation.setOptions({
            // eslint-disable-next-line react/no-multi-comp
            tabBarLabel: () => (<TabBarLabelCounter_1.TabBarLabelCounter activeUnreadNr={activeUnreadPollsNr} isFocused={isPollsTabFocused} label={t('chat.tabs.polls')} nbUnread={nbUnreadPolls}/>)
        });
    }, [isPollsTabFocused, nbUnreadPolls]);
    const createPollButtonStyles = react_native_1.Platform.OS === 'android'
        ? styles_1.chatStyles.createPollButtonAndroid : styles_1.chatStyles.createPollButtonIos;
    return (<JitsiScreen_1.default contentContainerStyle={styles_1.chatStyles.pollPane} disableForcedKeyboardDismiss={true} hasExtraHeaderHeight={true} style={styles_1.chatStyles.pollPaneContainer}>
            {createMode
            ? <PollCreate_1.default setCreateMode={setCreateMode}/>
            : <>
                        <PollsList_1.default setCreateMode={setCreateMode}/>
                        <Button_1.default accessibilityLabel='polls.create.create' labelKey='polls.create.create' onClick={onCreate} style={createPollButtonStyles} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
                    </>}
        </JitsiScreen_1.default>);
};
/*
 * We apply AbstractPollsPane to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollsPane_1.default)(PollsPane);
