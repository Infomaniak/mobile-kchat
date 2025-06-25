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
const react_redux_1 = require("react-redux");
const functions_native_1 = require("../../../app/functions.native");
const actions_1 = require("../../../base/settings/actions");
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const functions_native_2 = require("../../functions.native");
const FormRow_1 = __importDefault(require("./FormRow"));
const FormSection_1 = __importDefault(require("./FormSection"));
const styles_1 = __importDefault(require("./styles"));
const ConferenceSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { serverURL, startCarMode, startWithAudioMuted, startWithVideoMuted } = (0, react_redux_1.useSelector)((state) => state['features/base/settings']);
    const defaultServerURL = (0, react_redux_1.useSelector)((state) => (0, functions_native_1.getDefaultURL)(state));
    const [newServerURL, setNewServerURL] = (0, react_1.useState)(serverURL ?? '');
    const serverURLChangeEnabled = (0, react_redux_1.useSelector)((state) => (0, functions_native_2.isServerURLChangeEnabled)(state));
    const switches = (0, react_1.useMemo)(() => [
        {
            label: 'settingsView.startCarModeInLowBandwidthMode',
            state: startCarMode,
            name: 'startCarMode'
        },
        {
            label: 'settingsView.startWithAudioMuted',
            state: startWithAudioMuted,
            name: 'startWithAudioMuted'
        },
        {
            label: 'settingsView.startWithVideoMuted',
            state: startWithVideoMuted,
            name: 'startWithVideoMuted'
        }
    ], [startCarMode, startWithAudioMuted, startWithVideoMuted]);
    const onChangeServerURL = (0, react_1.useCallback)(value => {
        setNewServerURL(value);
        dispatch((0, actions_1.updateSettings)({
            serverURL: value
        }));
    }, [dispatch, newServerURL]);
    const processServerURL = (0, react_1.useCallback)(() => {
        const normalizedURL = (0, functions_native_2.normalizeUserInputURL)(newServerURL);
        onChangeServerURL(normalizedURL);
    }, [newServerURL]);
    (0, react_1.useEffect)(() => () => processServerURL(), []);
    const onSwitchToggled = (0, react_1.useCallback)((name) => (enabled) => {
        // @ts-ignore
        dispatch((0, actions_1.updateSettings)({ [name]: enabled }));
    }, [dispatch]);
    return (<FormSection_1.default label='settingsView.conferenceSection'>
            <Input_1.default autoCapitalize='none' customStyles={{ container: styles_1.default.customContainer }} editable={serverURLChangeEnabled} keyboardType={'url'} label={t('settingsView.serverURL')} onBlur={processServerURL} onChange={onChangeServerURL} placeholder={defaultServerURL} textContentType={'URL'} // iOS only
     value={newServerURL}/>
            {switches.map(({ label, state, name }) => (<FormRow_1.default key={label} label={label}>
                        <Switch_1.default checked={Boolean(state)} onChange={onSwitchToggled(name)}/>
                    </FormRow_1.default>))}
        </FormSection_1.default>);
};
exports.default = ConferenceSection;
