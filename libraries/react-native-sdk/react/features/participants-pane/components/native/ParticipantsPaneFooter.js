"use strict";
/* eslint-disable lines-around-comment */
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
const actions_1 = require("../../../base/dialog/actions");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const IconButton_1 = __importDefault(require("../../../base/ui/components/native/IconButton"));
const constants_native_1 = require("../../../base/ui/constants.native");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
// @ts-ignore
const MuteEveryoneDialog_1 = __importDefault(require("../../../video-menu/components/native/MuteEveryoneDialog"));
const functions_2 = require("../../functions");
const ContextMenuMore_1 = require("./ContextMenuMore");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the participants pane footer component.
 *
 * @returns { JSX.Element} - The participants pane footer component.
 */
const ParticipantsPaneFooter = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const isBreakoutRoomsSupported = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported());
    const isBreakoutRoomsEnabled = (0, react_redux_1.useSelector)((state) => (0, functions_1.getFeatureFlag)(state, constants_1.BREAKOUT_ROOMS_BUTTON_ENABLED, true));
    const openMoreMenu = (0, react_1.useCallback)(() => dispatch((0, actions_1.openSheet)(ContextMenuMore_1.ContextMenuMore)), [dispatch]);
    const muteAll = (0, react_1.useCallback)(() => dispatch((0, actions_1.openDialog)(MuteEveryoneDialog_1.default)), [dispatch]);
    const showMoreActions = (0, react_redux_1.useSelector)(functions_2.isMoreActionsVisible);
    const showMuteAll = (0, react_redux_1.useSelector)(functions_2.isMuteAllVisible);
    return (<react_native_1.View style={styles_1.default.participantsPaneFooterContainer}>
            {isBreakoutRoomsSupported
            && isBreakoutRoomsEnabled
            && <Button_1.default accessibilityLabel='participantsPane.actions.breakoutRooms' 
            // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
            icon={() => (<Icon_1.default color={BaseTheme_native_1.default.palette.icon04} size={20} src={svg_1.IconRingGroup}/>)} labelKey='participantsPane.actions.breakoutRooms' 
            // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
            onClick={() => (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.breakoutRooms)} style={styles_1.default.breakoutRoomsButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>}

            <react_native_1.View style={styles_1.default.participantsPaneFooter}>
                {showMuteAll && (<Button_1.default accessibilityLabel='participantsPane.actions.muteAll' labelKey='participantsPane.actions.muteAll' onClick={muteAll} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>)}
                {showMoreActions && (<IconButton_1.default onPress={openMoreMenu} src={svg_1.IconDotsHorizontal} style={styles_1.default.moreButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>)}
            </react_native_1.View>
        </react_native_1.View>);
};
exports.default = ParticipantsPaneFooter;
