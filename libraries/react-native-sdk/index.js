"use strict";
/* eslint-disable lines-around-comment,  no-undef, no-unused-vars  */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitsiMeeting = void 0;
// NB: This import must always come first.
require("./react/bootstrap.native");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const actions_native_1 = require("./react/features/app/actions.native");
const App_native_1 = require("./react/features/app/components/App.native");
const actions_1 = require("./react/features/base/media/actions");
const functions_1 = require("./react/features/breakout-rooms/functions");
/**
 * Main React Native SDK component that displays a Jitsi Meet conference and gets all required params as props
 */
exports.JitsiMeeting = (0, react_1.forwardRef)((props, ref) => {
    const [appProps, setAppProps] = (0, react_1.useState)({});
    const app = (0, react_1.useRef)(null);
    const { config, eventListeners, flags, room, serverURL, style, token, userInfo } = props;
    // eslint-disable-next-line arrow-body-style
    (0, react_1.useImperativeHandle)(ref, () => ({
        close: () => {
            const dispatch = app.current.state.store.dispatch;
            dispatch((0, actions_native_1.appNavigate)(undefined));
        },
        setAudioMuted: muted => {
            const dispatch = app.current.state.store.dispatch;
            dispatch((0, actions_1.setAudioMuted)(muted));
        },
        setVideoMuted: muted => {
            const dispatch = app.current.state.store.dispatch;
            dispatch((0, actions_1.setVideoMuted)(muted));
        },
        getRoomsInfo: () => {
            const state = app.current.state.store.getState();
            return (0, functions_1.getRoomsInfo)(state);
        }
    }));
    (0, react_1.useEffect)(() => {
        const urlObj = {
            config,
            jwt: token
        };
        let urlProps;
        if (room.includes('://')) {
            urlProps = {
                ...urlObj,
                url: room
            };
        }
        else {
            urlProps = {
                ...urlObj,
                room,
                serverURL
            };
        }
        setAppProps({
            'flags': flags,
            'rnSdkHandlers': {
                onAudioMutedChanged: eventListeners?.onAudioMutedChanged,
                onVideoMutedChanged: eventListeners?.onVideoMutedChanged,
                onConferenceBlurred: eventListeners?.onConferenceBlurred,
                onConferenceFocused: eventListeners?.onConferenceFocused,
                onConferenceJoined: eventListeners?.onConferenceJoined,
                onConferenceWillJoin: eventListeners?.onConferenceWillJoin,
                onConferenceLeft: eventListeners?.onConferenceLeft,
                onEnterPictureInPicture: eventListeners?.onEnterPictureInPicture,
                onParticipantJoined: eventListeners?.onParticipantJoined,
                onParticipantLeft: eventListeners?.onParticipantLeft,
                onReadyToClose: eventListeners?.onReadyToClose
            },
            'url': urlProps,
            'userInfo': userInfo
        });
    }, []);
    // eslint-disable-next-line arrow-body-style
    (0, react_1.useLayoutEffect)(() => {
        /**
         * When you close the component you need to reset it.
         * In some cases it needs to be added as the parent component may have been destroyed.
         * Without this change the call remains active without having the jitsi screen.
        */
        return () => {
            const dispatch = app.current?.state?.store?.dispatch;
            dispatch && dispatch((0, actions_native_1.appNavigate)(undefined));
        };
    }, []);
    return (<react_native_1.View style={style}>
            <App_native_1.App {...appProps} ref={app}/>
        </react_native_1.View>);
});
